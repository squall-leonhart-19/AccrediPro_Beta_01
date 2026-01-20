"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
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
    FileText,
    Phone,
    Mail,
    X,
    Loader2,
    ClipboardList,
    TrendingUp,
    Heart,
    Target,
    MessageSquare,
    Video,
    Stethoscope,
    ChevronRight,
    ArrowUpRight,
    Zap,
    Send,
    Eye,
    Edit,
    Activity,
    Check,
    Trash2,
    UserCircle,
    Camera,
    Globe,
    Instagram,
    Link,
    Award,
    Briefcase,
    Star,
    MapPin,
    Sparkles,
    ExternalLink,
    Save,
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

interface Stats {
    totalClients: number;
    activeClients: number;
    pendingTasks: number;
    thisWeekSessions: number;
}

interface CoachWorkspaceClientProps {
    clients: Client[];
    stats: Stats;
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
        description: "Comprehensive gut healing protocol with elimination diet, probiotics, and lifestyle adjustments.",
        phases: [
            { week: 1, title: "Elimination Phase", focus: "Remove inflammatory foods (gluten, dairy, sugar, alcohol). Begin food journal. Introduce bone broth daily." },
            { week: 2, title: "Heal & Seal", focus: "Add L-glutamine and zinc. Increase fiber slowly. Practice mindful eating. Morning lemon water." },
            { week: 3, title: "Repopulate", focus: "Introduce high-quality probiotic. Add fermented foods (sauerkraut, kimchi). Prebiotic fiber increase." },
            { week: 4, title: "Reintroduce", focus: "Slowly reintroduce foods one at a time. Track reactions. Establish sustainable eating patterns." },
        ],
        supplements: ["L-Glutamine", "Zinc Carnosine", "Probiotic 50B CFU", "Digestive Enzymes"],
        focus: ["Gut microbiome optimization", "Leaky gut repair", "Inflammation reduction", "Digestive symptom relief"]
    },
    {
        id: "hormone-balance",
        name: "Hormone Balance Protocol",
        category: "Hormones",
        icon: "⚖️",
        weeks: 8,
        description: "Balance hormones naturally through diet, stress management, and targeted supplements.",
        phases: [
            { week: 1, title: "Assessment", focus: "Hormone symptom tracking. Blood sugar stabilization. Remove endocrine disruptors from home." },
            { week: 2, title: "Foundation", focus: "Balance blood sugar with protein/fat combos. Seed cycling begins. Morning sunlight exposure." },
            { week: 3, title: "Liver Support", focus: "Support liver detox pathways. Cruciferous vegetables daily. DIM supplement introduction." },
            { week: 4, title: "Adrenal Focus", focus: "Cortisol management. Adaptogens (ashwagandha). No caffeine after 12pm. Earlier bedtime." },
            { week: 5, title: "Thyroid Support", focus: "Iodine-rich foods. Selenium supplementation. Eliminate goitrogens if needed." },
            { week: 6, title: "Estrogen Balance", focus: "Fiber for estrogen elimination. Reduce xenoestrogens. Flax seeds daily." },
            { week: 7, title: "Progesterone Support", focus: "Vitex introduction. Stress reduction priority. Magnesium at night." },
            { week: 8, title: "Integration", focus: "Assess improvements. Create maintenance plan. Retest if needed." },
        ],
        supplements: ["Vitex", "DIM", "Magnesium Glycinate", "Ashwagandha", "Omega-3"],
        focus: ["PMS reduction", "Cycle regulation", "Mood stability", "Energy balance"]
    },
    {
        id: "stress-reset",
        name: "Stress & Cortisol Reset",
        category: "Stress",
        icon: "🧘",
        weeks: 6,
        description: "Lower cortisol and manage stress through breathwork, sleep optimization, and adaptogens.",
        phases: [
            { week: 1, title: "Awareness", focus: "Track stress triggers. Morning cortisol measurement. Remove 1 stressor." },
            { week: 2, title: "Breathwork", focus: "4-7-8 breathing 3x daily. No phone first hour. Intro box breathing." },
            { week: 3, title: "Adaptogens", focus: "Begin ashwagandha/rhodiola. Afternoon nature walk. Reduce caffeine 50%." },
            { week: 4, title: "Sleep Priority", focus: "10pm bedtime goal. Magnesium before bed. Blue light blocking after 8pm." },
            { week: 5, title: "Nervous System", focus: "Cold exposure intro. Vagus nerve exercises. Gentle yoga or stretching." },
            { week: 6, title: "Integration", focus: "Build sustainable routine. Identify non-negotiables. Create stress toolkit." },
        ],
        supplements: ["Ashwagandha KSM-66", "Rhodiola", "Magnesium L-Threonate", "L-Theanine", "Phosphatidylserine"],
        focus: ["Cortisol reduction", "Better sleep", "Mental clarity", "Nervous system regulation"]
    },
    {
        id: "energy-boost",
        name: "Energy Optimization",
        category: "Energy",
        icon: "⚡",
        weeks: 4,
        description: "Boost energy through mitochondrial support, blood sugar balance, and lifestyle changes.",
        phases: [
            { week: 1, title: "Blood Sugar", focus: "Protein at every meal. No skipping breakfast. Track energy levels hourly." },
            { week: 2, title: "Mitochondria", focus: "CoQ10 and B vitamins intro. Movement every hour. Red light exposure." },
            { week: 3, title: "Iron & B12", focus: "Test levels if needed. Optimize iron intake. Methylated B complex." },
            { week: 4, title: "Lifestyle", focus: "Morning sunlight ritual. Optimize sleep timing. Cold shower protocol." },
        ],
        supplements: ["CoQ10 (Ubiquinol)", "B-Complex (Methylated)", "Iron (if deficient)", "D-Ribose", "PQQ"],
        focus: ["Sustained energy", "No afternoon crash", "Mental sharpness", "Physical vitality"]
    },
    {
        id: "sleep-restore",
        name: "Sleep Restoration",
        category: "Sleep",
        icon: "😴",
        weeks: 4,
        description: "Improve sleep quality with circadian rhythm optimization and evening routines.",
        phases: [
            { week: 1, title: "Sleep Hygiene", focus: "Consistent wake time. Bedroom temp 65-68°F. Remove screens from bedroom." },
            { week: 2, title: "Wind-Down", focus: "No screens 2hrs before bed. Dim lights after sunset. Journaling practice." },
            { week: 3, title: "Supplements", focus: "Magnesium glycinate. Glycine before bed. Tart cherry for melatonin." },
            { week: 4, title: "Deep Sleep", focus: "No eating 3hrs before bed. Hot bath/shower before sleep. Track sleep stages." },
        ],
        supplements: ["Magnesium Glycinate", "Glycine", "Tart Cherry Extract", "L-Theanine", "Apigenin"],
        focus: ["Fall asleep faster", "Stay asleep", "Wake refreshed", "Deep sleep increase"]
    },
    {
        id: "detox",
        name: "Gentle Detox Program",
        category: "Detox",
        icon: "🌿",
        weeks: 3,
        description: "Support your body's natural detox pathways with whole foods and gentle herbs.",
        phases: [
            { week: 1, title: "Pre-Tox", focus: "Increase water to 3L. Daily cruciferous vegetables. Dry brushing before shower." },
            { week: 2, title: "Active Detox", focus: "Milk thistle and NAC. Sauna 3x/week. Castor oil packs on liver." },
            { week: 3, title: "Elimination", focus: "Fiber increase for elimination. Binders if needed. Gentle movement daily." },
        ],
        supplements: ["Milk Thistle", "NAC", "Glutathione (Liposomal)", "Chlorella", "Activated Charcoal"],
        focus: ["Liver support", "Heavy metal drainage", "Lymphatic flow", "Skin clarity"]
    },
];

const INTAKE_FORMS = [
    { id: "health-history", name: "Health History Questionnaire", icon: "📋", status: "pending" },
    { id: "lifestyle", name: "Lifestyle Assessment", icon: "🏃", status: "pending" },
    { id: "nutrition", name: "Nutrition & Diet Intake", icon: "🥦", status: "pending" },
    { id: "goals", name: "Goals & Vision Worksheet", icon: "🎯", status: "pending" },
    { id: "consent", name: "Coaching Agreement & Consent", icon: "✍️", status: "pending" },
];

export function CoachWorkspaceClient({ clients: initialClients, stats }: CoachWorkspaceClientProps) {
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

    // Assessment state
    const [assessmentType, setAssessmentType] = useState<string>("");
    const [assessmentScore, setAssessmentScore] = useState<number>(0);
    const [savingAssessment, setSavingAssessment] = useState(false);

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

    // Coach Profile State
    const [coachProfile, setCoachProfile] = useState({
        photoUrl: "",
        shortBio: "",
        longBio: "",
        nicheStatement: "",
        specializations: [] as string[],
        bookingLink: "",
        websiteUrl: "",
        instagramUrl: "",
        facebookUrl: "",
        services: [] as string[],
        packages: [] as { name: string; description: string; duration: string; price: string }[],
        testimonials: [] as { name: string; text: string }[],
    });
    const [profileSaving, setProfileSaving] = useState(false);

    // Specialization options
    const SPECIALIZATIONS = [
        "Functional Medicine", "Gut Health", "Hormone Health", "Women's Health",
        "Neurodiversity", "ADHD Support", "Autism Support", "Trauma-Informed",
        "Emotional Wellness", "Stress Management", "Weight Management", "Sleep Optimization",
        "Nutrition Coaching", "Holistic Health", "Chronic Pain", "Autoimmune Support",
        "Mental Health", "Spiritual Healing", "Energy Healing", "Life Coaching"
    ];

    // Service options
    const SERVICES = [
        "1:1 Coaching", "Group Coaching", "Workshops", "Online Programs",
        "Corporate Wellness", "Retreats", "Speaking Engagements"
    ];

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

    // Helper functions
    const getInitials = (name: string) => name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

    const getStatusColor = (status: string) => {
        switch (status) {
            case "ACTIVE": return "bg-green-100 text-green-700 border-green-200";
            case "PAUSED": return "bg-yellow-100 text-yellow-700 border-yellow-200";
            case "COMPLETED": return "bg-blue-100 text-blue-700 border-blue-200";
            default: return "bg-gray-100 text-gray-700 border-gray-200";
        }
    };

    // API Functions
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
                const client = { ...data.data, sessions: [], tasks: [], protocols: [], _count: { sessions: 0, tasks: 0, protocols: 0 } };
                setClients((prev) => [client, ...prev]);
                setNewClient({ name: "", email: "", phone: "", notes: "" });
                setShowAddClient(false);
            }
        } catch (error) {
            console.error("Add client error:", error);
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
                    duration: SESSION_TEMPLATES.find(t => t.id === newSession.type)?.duration || 45,
                }),
            });
            const data = await res.json();
            if (data.success) {
                const newSessionData = { id: data.data.id, date: new Date(newSession.date), notes: newSession.notes, sessionType: newSession.type };
                setSelectedClient(prev => prev ? { ...prev, sessions: [newSessionData, ...prev.sessions], _count: { ...prev._count, sessions: prev._count.sessions + 1 } } : null);
                setNewSession({ type: "", date: "", notes: "" });
                setShowAddSession(false);
            }
        } catch (error) {
            console.error("Add session error:", error);
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
                    startDate: new Date().toISOString(),
                }),
            });
            const data = await res.json();
            if (data.success) {
                const newProtocol = { id: data.data.id, name: selectedProtocol.name, status: "ACTIVE" };
                setSelectedClient(prev => prev ? { ...prev, protocols: [newProtocol, ...prev.protocols], _count: { ...prev._count, protocols: prev._count.protocols + 1 } } : null);
                setSelectedProtocol(null);
                setShowAssignProtocol(false);
            }
        } catch (error) {
            console.error("Assign protocol error:", error);
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
                body: JSON.stringify({
                    task: newTask.task,
                    dueDate: newTask.dueDate || null,
                }),
            });
            const data = await res.json();
            if (data.success) {
                const task = { id: data.data.id, task: newTask.task, dueDate: newTask.dueDate ? new Date(newTask.dueDate) : null, completed: false };
                setSelectedClient(prev => prev ? { ...prev, tasks: [...prev.tasks, task], _count: { ...prev._count, tasks: prev._count.tasks + 1 } } : null);
                setNewTask({ task: "", dueDate: "" });
                setShowAddTask(false);
            }
        } catch (error) {
            console.error("Add task error:", error);
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
            setSelectedClient(prev => prev ? { ...prev, notes: clientNotes } : null);
        } catch (error) {
            console.error("Save notes error:", error);
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
            setSelectedClient(prev => prev ? { ...prev, tasks: prev.tasks.filter(t => t.id !== taskId) } : null);
        } catch (error) {
            console.error("Complete task error:", error);
        }
    };

    return (
        <>
            {/* AccrediPro Coach Workspace Header */}
            <div className="bg-gradient-to-br from-burgundy-700 via-burgundy-800 to-burgundy-900 relative overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute inset-0">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold-400/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
                    <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-burgundy-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />
                    <div className="absolute inset-0 bg-[url('/patterns/grid.svg')] opacity-5" />
                </div>
                <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        {/* Left: AccrediPro Branding + Stats */}
                        <div className="flex items-start gap-5">
                            <div className="w-14 h-14 bg-gradient-to-br from-gold-400 to-gold-500 rounded-2xl flex items-center justify-center shadow-lg shadow-gold-500/20">
                                <Award className="w-7 h-7 text-burgundy-900" />
                            </div>
                            <div>
                                <div className="flex items-center gap-3 mb-1">
                                    <h1 className="text-2xl md:text-3xl font-bold text-white">AccrediPro Coach Workspace</h1>
                                    <Badge className="bg-gold-400/20 text-gold-300 border-gold-400/30 text-xs font-semibold">Certified</Badge>
                                </div>
                                <p className="text-burgundy-200 text-sm mb-3">Your all-in-one coaching business hub</p>
                                {/* Mini Stats */}
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2 text-white/80">
                                        <Users className="w-4 h-4" />
                                        <span className="text-sm font-medium">{stats.totalClients} Clients</span>
                                    </div>
                                    <div className="w-px h-4 bg-white/20" />
                                    <div className="flex items-center gap-2 text-green-400">
                                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                                        <span className="text-sm font-medium">{stats.activeClients} Active</span>
                                    </div>
                                    <div className="w-px h-4 bg-white/20" />
                                    <div className="flex items-center gap-2 text-gold-300">
                                        <CheckSquare className="w-4 h-4" />
                                        <span className="text-sm font-medium">{stats.pendingTasks} Tasks</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right: Support + Actions */}
                        <div className="flex items-center gap-3">
                            {/* Quick Stats Card */}
                            <div className="hidden lg:flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/10">
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-white">{stats.thisWeekSessions}</p>
                                    <p className="text-xs text-burgundy-200">Sessions This Week</p>
                                </div>
                            </div>
                            {/* Chat with Sarah */}
                            <a href="/messages" className="flex items-center gap-4 bg-white/10 hover:bg-white/15 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/10 transition-all group shadow-lg">
                                <div className="relative">
                                    <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-gold-400/50 shadow-lg">
                                        <img src="/coaches/sarah-coach.webp" alt="Coach Sarah" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-burgundy-800" />
                                </div>
                                <div className="hidden sm:block">
                                    <p className="text-white font-semibold text-sm">Need Help?</p>
                                    <p className="text-burgundy-200 text-xs">Ask your mentor</p>
                                </div>
                                <MessageSquare className="w-5 h-5 text-white/70 group-hover:text-white" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">

            {/* MODALS */}

            {/* Add Client Modal */}
            {showAddClient && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-lg">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-gray-900">Add New Client</h3>
                            <button onClick={() => setShowAddClient(false)}><X className="w-5 h-5 text-gray-400" /></button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-1.5 block">Full Name *</label>
                                <Input value={newClient.name} onChange={(e) => setNewClient({ ...newClient, name: e.target.value })} placeholder="Jane Smith" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-700 mb-1.5 block">Email</label>
                                    <Input type="email" value={newClient.email} onChange={(e) => setNewClient({ ...newClient, email: e.target.value })} placeholder="jane@email.com" />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700 mb-1.5 block">Phone</label>
                                    <Input value={newClient.phone} onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })} placeholder="+1 (555) 000-0000" />
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-1.5 block">Initial Notes</label>
                                <Textarea value={newClient.notes} onChange={(e) => setNewClient({ ...newClient, notes: e.target.value })} placeholder="Health goals..." rows={3} />
                            </div>
                            <div className="pt-4 flex gap-3">
                                <Button variant="outline" onClick={() => setShowAddClient(false)} className="flex-1">Cancel</Button>
                                <Button onClick={handleAddClient} disabled={saving || !newClient.name.trim()} className="flex-1 bg-burgundy-600 hover:bg-burgundy-700">
                                    {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />} Add Client
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Session Modal */}
            {showAddSession && selectedClient && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-lg">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-gray-900">Log Session with {selectedClient.name}</h3>
                            <button onClick={() => setShowAddSession(false)}><X className="w-5 h-5 text-gray-400" /></button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-2 block">Session Type *</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {SESSION_TEMPLATES.map((t) => (
                                        <button
                                            key={t.id}
                                            onClick={() => setNewSession({ ...newSession, type: t.id })}
                                            className={cn("p-3 rounded-xl border text-left transition-all", newSession.type === t.id ? "border-burgundy-500 bg-burgundy-50" : "border-gray-200 hover:border-burgundy-200")}
                                        >
                                            <span className="text-xl">{t.icon}</span>
                                            <p className="text-sm font-medium mt-1">{t.name}</p>
                                            <p className="text-xs text-gray-500">{t.duration} min</p>
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-1.5 block">Date *</label>
                                <Input type="datetime-local" value={newSession.date} onChange={(e) => setNewSession({ ...newSession, date: e.target.value })} />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-1.5 block">Session Notes</label>
                                <Textarea value={newSession.notes} onChange={(e) => setNewSession({ ...newSession, notes: e.target.value })} placeholder="What was discussed, action items, observations..." rows={4} />
                            </div>
                            <div className="pt-4 flex gap-3">
                                <Button variant="outline" onClick={() => setShowAddSession(false)} className="flex-1">Cancel</Button>
                                <Button onClick={handleAddSession} disabled={saving || !newSession.type || !newSession.date} className="flex-1 bg-burgundy-600 hover:bg-burgundy-700">
                                    {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Check className="w-4 h-4 mr-2" />} Save Session
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Assign Protocol Modal */}
            {showAssignProtocol && selectedClient && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-gray-900">Assign Protocol to {selectedClient.name}</h3>
                            <button onClick={() => { setShowAssignProtocol(false); setSelectedProtocol(null); }}><X className="w-5 h-5 text-gray-400" /></button>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4 mb-6">
                            {PROTOCOL_TEMPLATES.map((p) => (
                                <button
                                    key={p.id}
                                    onClick={() => setSelectedProtocol(p)}
                                    className={cn("p-4 rounded-xl border text-left transition-all", selectedProtocol?.id === p.id ? "border-burgundy-500 bg-burgundy-50 ring-2 ring-burgundy-200" : "border-gray-200 hover:border-burgundy-200")}
                                >
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="text-3xl">{p.icon}</span>
                                        <div>
                                            <p className="font-medium text-gray-900">{p.name}</p>
                                            <p className="text-xs text-gray-500">{p.category} • {p.weeks} weeks</p>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-600">{p.description}</p>
                                </button>
                            ))}
                        </div>
                        <div className="flex gap-3">
                            <Button variant="outline" onClick={() => { setShowAssignProtocol(false); setSelectedProtocol(null); }} className="flex-1">Cancel</Button>
                            <Button onClick={handleAssignProtocol} disabled={saving || !selectedProtocol} className="flex-1 bg-burgundy-600 hover:bg-burgundy-700">
                                {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <ClipboardList className="w-4 h-4 mr-2" />} Assign Protocol
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Task Modal */}
            {showAddTask && selectedClient && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-gray-900">Add Task for {selectedClient.name}</h3>
                            <button onClick={() => setShowAddTask(false)}><X className="w-5 h-5 text-gray-400" /></button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-1.5 block">Task *</label>
                                <Input value={newTask.task} onChange={(e) => setNewTask({ ...newTask, task: e.target.value })} placeholder="e.g. Complete food diary for 3 days" />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-1.5 block">Due Date (optional)</label>
                                <Input type="date" value={newTask.dueDate} onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })} />
                            </div>
                            <div className="pt-4 flex gap-3">
                                <Button variant="outline" onClick={() => setShowAddTask(false)} className="flex-1">Cancel</Button>
                                <Button onClick={handleAddTask} disabled={saving || !newTask.task.trim()} className="flex-1 bg-burgundy-600 hover:bg-burgundy-700">
                                    {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />} Add Task
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Send Form Modal */}
            {showSendForm && selectedClient && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-lg">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-gray-900">Send Form to {selectedClient.name}</h3>
                            <button onClick={() => setShowSendForm(false)}><X className="w-5 h-5 text-gray-400" /></button>
                        </div>
                        {!selectedClient.email ? (
                            <div className="text-center py-8">
                                <Mail className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                <p className="text-gray-600 mb-2">No email address for this client</p>
                                <p className="text-sm text-gray-400">Add an email address to send intake forms</p>
                            </div>
                        ) : (
                            <div className="space-y-3 mb-6">
                                {INTAKE_FORMS.map((form) => (
                                    <div key={form.id} className="flex items-center gap-4 p-4 border border-gray-100 rounded-xl hover:border-burgundy-200 transition-colors">
                                        <span className="text-2xl">{form.icon}</span>
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-900">{form.name}</p>
                                        </div>
                                        <Button
                                            size="sm"
                                            onClick={async () => {
                                                setSaving(true);
                                                try {
                                                    const res = await fetch("/api/coach/intake-forms", {
                                                        method: "POST",
                                                        headers: { "Content-Type": "application/json" },
                                                        body: JSON.stringify({
                                                            clientId: selectedClient.id,
                                                            formType: form.id,
                                                        }),
                                                    });
                                                    const data = await res.json();
                                                    if (data.success) {
                                                        toast.success(`${form.name} sent to ${selectedClient.email}!`);
                                                        setShowSendForm(false);
                                                    } else {
                                                        toast.error(data.error || "Failed to send form");
                                                    }
                                                } catch (error) {
                                                    console.error("Send form error:", error);
                                                    toast.error("Failed to send form");
                                                } finally {
                                                    setSaving(false);
                                                }
                                            }}
                                            disabled={saving}
                                        >
                                            {saving ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <Send className="w-3 h-3 mr-1" />} Send
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                        <Button variant="outline" onClick={() => setShowSendForm(false)} className="w-full">Close</Button>
                    </div>
                </div>
            )}

            {/* Main Content - Full Width */}
            <div>
                    {selectedClient ? (
                        <div className="space-y-6">
                            {/* Client Header */}
                            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                                <div className="bg-gradient-to-r from-burgundy-600 to-burgundy-700 p-6 text-white">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-4">
                                            <Avatar className="h-16 w-16 ring-4 ring-white/30">
                                                <AvatarFallback className="bg-white text-burgundy-700 text-xl font-bold">{getInitials(selectedClient.name)}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <h2 className="text-2xl font-bold">{selectedClient.name}</h2>
                                                <div className="flex items-center gap-4 mt-1 text-white/80 text-sm">
                                                    {selectedClient.email && <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" />{selectedClient.email}</span>}
                                                    {selectedClient.phone && <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" />{selectedClient.phone}</span>}
                                                </div>
                                                {/* Case Type / Package Info */}
                                                <div className="flex items-center gap-2 mt-2">
                                                    {selectedClient.packageType && (
                                                        <Badge className="bg-white/20 text-white border-0">{selectedClient.packageType}</Badge>
                                                    )}
                                                    {selectedClient.conditions && selectedClient.conditions.length > 0 && (
                                                        <Badge className="bg-amber-400/90 text-amber-900 border-0">
                                                            Case: {selectedClient.conditions.slice(0, 2).join(", ")}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                            <Badge className={cn("border", getStatusColor(selectedClient.status))}>{selectedClient.status}</Badge>
                                            <a href="/messages" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white text-sm transition-colors">
                                                <MessageSquare className="w-4 h-4" /> Ask Your Coach
                                            </a>
                                        </div>
                                    </div>
                                    {/* Primary Concerns Summary */}
                                    {selectedClient.primaryConcerns && (
                                        <div className="mt-4 p-3 bg-white/10 rounded-xl">
                                            <p className="text-white/70 text-xs font-medium mb-1">Primary Concerns</p>
                                            <p className="text-white/90 text-sm line-clamp-2">{selectedClient.primaryConcerns}</p>
                                        </div>
                                    )}
                                </div>
                                <div className="grid grid-cols-4 divide-x divide-gray-100">
                                    {[
                                        { label: "Sessions", value: selectedClient._count.sessions, icon: Calendar },
                                        { label: "Tasks", value: selectedClient.tasks.length, icon: CheckSquare },
                                        { label: "Protocols", value: selectedClient._count.protocols, icon: ClipboardList },
                                        { label: "Progress", value: "—", icon: TrendingUp },
                                    ].map((stat) => (
                                        <div key={stat.label} className="p-4 text-center">
                                            <stat.icon className="w-5 h-5 mx-auto mb-1 text-gray-400" />
                                            <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                                            <p className="text-xs text-gray-500">{stat.label}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Tabs */}
                            <Tabs value={activeTab} onValueChange={setActiveTab}>
                                <TabsList className="bg-gray-100 p-1 rounded-xl overflow-x-auto">
                                    <TabsTrigger value="overview" className="rounded-lg px-4"><Activity className="w-4 h-4 mr-2" />Overview</TabsTrigger>
                                    <TabsTrigger value="health" className="rounded-lg px-4"><Heart className="w-4 h-4 mr-2" />Health Profile</TabsTrigger>
                                    <TabsTrigger value="sessions" className="rounded-lg px-4"><Calendar className="w-4 h-4 mr-2" />Sessions</TabsTrigger>
                                    <TabsTrigger value="progress" className="rounded-lg px-4"><TrendingUp className="w-4 h-4 mr-2" />Progress</TabsTrigger>
                                    <TabsTrigger value="protocols" className="rounded-lg px-4"><ClipboardList className="w-4 h-4 mr-2" />Protocols</TabsTrigger>
                                    <TabsTrigger value="tasks" className="rounded-lg px-4"><CheckSquare className="w-4 h-4 mr-2" />Tasks</TabsTrigger>
                                    <TabsTrigger value="notes" className="rounded-lg px-4"><Edit className="w-4 h-4 mr-2" />Notes</TabsTrigger>
                                </TabsList>

                                {/* Overview Tab */}
                                <TabsContent value="overview" className="mt-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        {/* Quick Actions - NOW FUNCTIONAL */}
                                        <div className="bg-white rounded-2xl border border-gray-100 p-5">
                                            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><Zap className="w-5 h-5 text-yellow-500" />Quick Actions</h3>
                                            <div className="grid grid-cols-2 gap-3">
                                                <Button variant="outline" onClick={() => setShowAddSession(true)} className="h-auto py-3 flex-col gap-1">
                                                    <Video className="w-5 h-5 text-blue-500" /><span className="text-xs">Log Session</span>
                                                </Button>
                                                <Button variant="outline" onClick={() => setShowSendForm(true)} className="h-auto py-3 flex-col gap-1">
                                                    <Send className="w-5 h-5 text-burgundy-500" /><span className="text-xs">Send Form</span>
                                                </Button>
                                                <Button variant="outline" onClick={() => setShowAssignProtocol(true)} className="h-auto py-3 flex-col gap-1">
                                                    <ClipboardList className="w-5 h-5 text-purple-500" /><span className="text-xs">Assign Protocol</span>
                                                </Button>
                                                <Button variant="outline" onClick={() => setShowAddTask(true)} className="h-auto py-3 flex-col gap-1">
                                                    <CheckSquare className="w-5 h-5 text-orange-500" /><span className="text-xs">Add Task</span>
                                                </Button>
                                            </div>
                                        </div>

                                        {/* Health Summary */}
                                        <div className="bg-white rounded-2xl border border-gray-100 p-5">
                                            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><Target className="w-5 h-5 text-burgundy-500" />Health Goals</h3>
                                            {selectedClient.healthGoals ? (
                                                <p className="text-sm text-gray-600">{selectedClient.healthGoals}</p>
                                            ) : (
                                                <p className="text-sm text-gray-400">No health goals set</p>
                                            )}
                                            {selectedClient.primaryConcerns && (
                                                <div className="mt-4 pt-4 border-t border-gray-100">
                                                    <p className="text-xs font-medium text-gray-500 mb-2">Primary Concerns</p>
                                                    <p className="text-sm text-gray-600">{selectedClient.primaryConcerns}</p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Active Protocol - FULL DETAILS */}
                                        <div className="bg-white rounded-2xl border border-gray-100 p-5 md:col-span-2">
                                            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><ClipboardList className="w-5 h-5 text-purple-500" />Active Protocol</h3>
                                            {selectedClient.protocols.length > 0 ? (
                                                (() => {
                                                    const activeProtocolName = selectedClient.protocols[0]?.name;
                                                    const protocolDetails = PROTOCOL_TEMPLATES.find(p => p.name === activeProtocolName);

                                                    if (protocolDetails) {
                                                        return (
                                                            <div className="space-y-4">
                                                                {/* Protocol Header */}
                                                                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-4 border border-purple-100">
                                                                    <div className="flex items-center gap-3 mb-3">
                                                                        <span className="text-4xl">{protocolDetails.icon}</span>
                                                                        <div>
                                                                            <h4 className="text-lg font-bold text-purple-900">{protocolDetails.name}</h4>
                                                                            <p className="text-sm text-purple-700">{protocolDetails.category} • {protocolDetails.weeks} weeks</p>
                                                                        </div>
                                                                        <Badge className="ml-auto bg-green-100 text-green-700 border-0">{selectedClient.protocols[0]?.status}</Badge>
                                                                    </div>
                                                                    <p className="text-sm text-purple-800">{protocolDetails.description}</p>
                                                                </div>

                                                                {/* Focus Areas */}
                                                                <div>
                                                                    <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Focus Areas</p>
                                                                    <div className="flex flex-wrap gap-2">
                                                                        {protocolDetails.focus.map((f, i) => (
                                                                            <Badge key={i} variant="outline" className="bg-white">{f}</Badge>
                                                                        ))}
                                                                    </div>
                                                                </div>

                                                                {/* Weekly Phases */}
                                                                <div>
                                                                    <p className="text-xs font-semibold text-gray-500 uppercase mb-3">Weekly Protocol Phases</p>
                                                                    <div className="space-y-2">
                                                                        {protocolDetails.phases.map((phase, i) => (
                                                                            <div key={i} className="flex gap-3 p-3 bg-gray-50 rounded-xl">
                                                                                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-sm flex-shrink-0">
                                                                                    {phase.week}
                                                                                </div>
                                                                                <div>
                                                                                    <p className="font-medium text-gray-900 text-sm">{phase.title}</p>
                                                                                    <p className="text-xs text-gray-600 mt-0.5">{phase.focus}</p>
                                                                                </div>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>

                                                                {/* Recommended Supplements */}
                                                                <div>
                                                                    <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Recommended Supplements</p>
                                                                    <div className="flex flex-wrap gap-2">
                                                                        {protocolDetails.supplements.map((s, i) => (
                                                                            <span key={i} className="px-3 py-1 bg-burgundy-50 text-burgundy-700 rounded-full text-xs font-medium">{s}</span>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    }

                                                    return (
                                                        <div className="bg-gradient-to-br from-burgundy-50 to-burgundy-100/50 rounded-xl p-4 border border-burgundy-100">
                                                            <p className="font-medium text-burgundy-900">{activeProtocolName}</p>
                                                            <Badge className="mt-2 bg-burgundy-100 text-burgundy-700 border-0">{selectedClient.protocols[0]?.status}</Badge>
                                                        </div>
                                                    );
                                                })()
                                            ) : (
                                                <div className="text-center py-6">
                                                    <ClipboardList className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                                                    <p className="text-sm text-gray-500 mb-2">No active protocol</p>
                                                    <Button size="sm" variant="outline" onClick={() => setShowAssignProtocol(true)}>
                                                        <Plus className="w-3 h-3 mr-1" /> Assign Protocol
                                                    </Button>
                                                </div>
                                            )}
                                        </div>

                                        {/* Pending Tasks */}
                                        <div className="bg-white rounded-2xl border border-gray-100 p-5">
                                            <div className="flex items-center justify-between mb-4">
                                                <h3 className="font-bold text-gray-900 flex items-center gap-2"><CheckSquare className="w-5 h-5 text-orange-500" />Pending Tasks</h3>
                                                <Button size="sm" variant="ghost" onClick={() => setShowAddTask(true)}><Plus className="w-4 h-4" /></Button>
                                            </div>
                                            {selectedClient.tasks.length > 0 ? (
                                                <div className="space-y-2">
                                                    {selectedClient.tasks.slice(0, 3).map((task) => (
                                                        <div key={task.id} className="flex items-center gap-3 p-3 bg-orange-50 rounded-xl">
                                                            <button onClick={() => handleCompleteTask(task.id)} className="w-5 h-5 rounded-full border-2 border-orange-300 hover:bg-orange-200 transition-colors" />
                                                            <p className="text-sm font-medium text-gray-900 flex-1">{task.task}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-sm text-gray-400 text-center py-4">No pending tasks</p>
                                            )}
                                        </div>
                                    </div>
                                </TabsContent>

                                {/* Health Profile Tab */}
                                <TabsContent value="health" className="mt-6">
                                    <div className="bg-white rounded-2xl border border-gray-100 p-6">
                                        <div className="flex items-center justify-between mb-6">
                                            <div>
                                                <h3 className="font-bold text-gray-900 text-xl">Health Profile</h3>
                                                <p className="text-sm text-gray-500">Complete health information for {selectedClient.name}</p>
                                            </div>
                                            {!editingHealth ? (
                                                <Button onClick={() => setEditingHealth(true)} variant="outline">
                                                    <Edit className="w-4 h-4 mr-2" /> Edit Profile
                                                </Button>
                                            ) : (
                                                <div className="flex gap-2">
                                                    <Button variant="outline" onClick={() => setEditingHealth(false)}>Cancel</Button>
                                                    <Button
                                                        className="bg-burgundy-600 hover:bg-burgundy-700"
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
                                                                    // Update selectedClient with new health data
                                                                    setSelectedClient(prev => prev ? {
                                                                        ...prev,
                                                                        ...data.data,
                                                                    } : null);
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
                                                {/* Primary Info */}
                                                <div className="grid md:grid-cols-3 gap-4">
                                                    <div className="p-4 bg-burgundy-50 rounded-xl">
                                                        <p className="text-xs font-medium text-burgundy-600 mb-1">Primary Concerns</p>
                                                        <p className="text-sm text-gray-900">{selectedClient.primaryConcerns || "Not specified"}</p>
                                                    </div>
                                                    <div className="p-4 bg-green-50 rounded-xl">
                                                        <p className="text-xs font-medium text-green-600 mb-1">Health Goals</p>
                                                        <p className="text-sm text-gray-900">{selectedClient.healthGoals || "Not specified"}</p>
                                                    </div>
                                                    <div className="p-4 bg-blue-50 rounded-xl">
                                                        <p className="text-xs font-medium text-blue-600 mb-1">Current Health Status</p>
                                                        <p className="text-sm text-gray-900">{selectedClient.currentHealth || "Not specified"}</p>
                                                    </div>
                                                </div>

                                                {/* Medical History */}
                                                <div>
                                                    <h4 className="font-semibold text-gray-900 mb-3">Medical History</h4>
                                                    <div className="grid md:grid-cols-2 gap-4">
                                                        <div className="p-4 bg-gray-50 rounded-xl">
                                                            <p className="text-xs font-medium text-gray-500 mb-2">Conditions</p>
                                                            {(selectedClient.conditions?.length ?? 0) > 0 ? (
                                                                <div className="flex flex-wrap gap-1">
                                                                    {selectedClient.conditions?.map((c, i) => (
                                                                        <Badge key={i} variant="outline" className="text-xs">{c}</Badge>
                                                                    ))}
                                                                </div>
                                                            ) : <p className="text-sm text-gray-400">None listed</p>}
                                                        </div>
                                                        <div className="p-4 bg-gray-50 rounded-xl">
                                                            <p className="text-xs font-medium text-gray-500 mb-2">Allergies</p>
                                                            {(selectedClient.allergies?.length ?? 0) > 0 ? (
                                                                <div className="flex flex-wrap gap-1">
                                                                    {selectedClient.allergies?.map((a, i) => (
                                                                        <Badge key={i} variant="outline" className="text-xs bg-red-50 border-red-200 text-red-700">{a}</Badge>
                                                                    ))}
                                                                </div>
                                                            ) : <p className="text-sm text-gray-400">None listed</p>}
                                                        </div>
                                                        <div className="p-4 bg-gray-50 rounded-xl">
                                                            <p className="text-xs font-medium text-gray-500 mb-2">Medications</p>
                                                            {(selectedClient.medications?.length ?? 0) > 0 ? (
                                                                <div className="flex flex-wrap gap-1">
                                                                    {selectedClient.medications?.map((m, i) => (
                                                                        <Badge key={i} variant="outline" className="text-xs">{m}</Badge>
                                                                    ))}
                                                                </div>
                                                            ) : <p className="text-sm text-gray-400">None listed</p>}
                                                        </div>
                                                        <div className="p-4 bg-gray-50 rounded-xl">
                                                            <p className="text-xs font-medium text-gray-500 mb-2">Supplements</p>
                                                            {(selectedClient.supplements?.length ?? 0) > 0 ? (
                                                                <div className="flex flex-wrap gap-1">
                                                                    {selectedClient.supplements?.map((s, i) => (
                                                                        <Badge key={i} variant="outline" className="text-xs bg-green-50 border-green-200 text-green-700">{s}</Badge>
                                                                    ))}
                                                                </div>
                                                            ) : <p className="text-sm text-gray-400">None listed</p>}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Lifestyle */}
                                                <div>
                                                    <h4 className="font-semibold text-gray-900 mb-3">Lifestyle</h4>
                                                    <div className="grid md:grid-cols-4 gap-4">
                                                        <div className="p-4 bg-gray-50 rounded-xl text-center">
                                                            <p className="text-2xl font-bold text-burgundy-600">{selectedClient.sleepHours || "-"}</p>
                                                            <p className="text-xs text-gray-500">Hours Sleep</p>
                                                        </div>
                                                        <div className="p-4 bg-gray-50 rounded-xl text-center">
                                                            <p className="text-lg font-semibold text-gray-900">{selectedClient.dietType || "-"}</p>
                                                            <p className="text-xs text-gray-500">Diet Type</p>
                                                        </div>
                                                        <div className="p-4 bg-gray-50 rounded-xl text-center">
                                                            <p className="text-lg font-semibold text-gray-900">{selectedClient.exerciseFreq || "-"}</p>
                                                            <p className="text-xs text-gray-500">Exercise</p>
                                                        </div>
                                                        <div className="p-4 bg-gray-50 rounded-xl text-center">
                                                            <p className="text-lg font-semibold text-gray-900">{selectedClient.stressLevel || "-"}</p>
                                                            <p className="text-xs text-gray-500">Stress Level</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Personal Info */}
                                                <div>
                                                    <h4 className="font-semibold text-gray-900 mb-3">Personal Information</h4>
                                                    <div className="grid md:grid-cols-3 gap-4">
                                                        <div className="p-4 bg-gray-50 rounded-xl">
                                                            <p className="text-xs font-medium text-gray-500">Date of Birth</p>
                                                            <p className="text-sm text-gray-900">{selectedClient.dateOfBirth ? new Date(selectedClient.dateOfBirth).toLocaleDateString() : "Not specified"}</p>
                                                        </div>
                                                        <div className="p-4 bg-gray-50 rounded-xl">
                                                            <p className="text-xs font-medium text-gray-500">Gender</p>
                                                            <p className="text-sm text-gray-900">{selectedClient.gender || "Not specified"}</p>
                                                        </div>
                                                        <div className="p-4 bg-gray-50 rounded-xl">
                                                            <p className="text-xs font-medium text-gray-500">Occupation</p>
                                                            <p className="text-sm text-gray-900">{selectedClient.occupation || "Not specified"}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Family History */}
                                                {selectedClient.familyHistory && (
                                                    <div>
                                                        <h4 className="font-semibold text-gray-900 mb-3">Family History</h4>
                                                        <p className="text-sm text-gray-600 p-4 bg-gray-50 rounded-xl">{selectedClient.familyHistory}</p>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            /* Edit Mode */
                                            <div className="space-y-6">
                                                {/* Primary Info */}
                                                <div className="grid md:grid-cols-1 gap-4">
                                                    <div>
                                                        <Label>Primary Concerns</Label>
                                                        <Textarea
                                                            value={healthForm.primaryConcerns}
                                                            onChange={(e) => setHealthForm({...healthForm, primaryConcerns: e.target.value})}
                                                            placeholder="What are the client's main health concerns?"
                                                            rows={2}
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label>Health Goals</Label>
                                                        <Textarea
                                                            value={healthForm.healthGoals}
                                                            onChange={(e) => setHealthForm({...healthForm, healthGoals: e.target.value})}
                                                            placeholder="What does the client want to achieve?"
                                                            rows={2}
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label>Current Health Status</Label>
                                                        <Textarea
                                                            value={healthForm.currentHealth}
                                                            onChange={(e) => setHealthForm({...healthForm, currentHealth: e.target.value})}
                                                            placeholder="Describe current health state"
                                                            rows={2}
                                                        />
                                                    </div>
                                                </div>

                                                {/* Medical History */}
                                                <div>
                                                    <h4 className="font-semibold text-gray-900 mb-3">Medical History</h4>
                                                    <div className="grid md:grid-cols-2 gap-4">
                                                        <div>
                                                            <Label>Conditions (comma-separated)</Label>
                                                            <Input
                                                                value={healthForm.conditions.join(", ")}
                                                                onChange={(e) => setHealthForm({...healthForm, conditions: e.target.value.split(",").map(s => s.trim()).filter(Boolean)})}
                                                                placeholder="Type 2 Diabetes, Hypertension"
                                                            />
                                                        </div>
                                                        <div>
                                                            <Label>Allergies (comma-separated)</Label>
                                                            <Input
                                                                value={healthForm.allergies.join(", ")}
                                                                onChange={(e) => setHealthForm({...healthForm, allergies: e.target.value.split(",").map(s => s.trim()).filter(Boolean)})}
                                                                placeholder="Peanuts, Shellfish"
                                                            />
                                                        </div>
                                                        <div>
                                                            <Label>Medications (comma-separated)</Label>
                                                            <Input
                                                                value={healthForm.medications.join(", ")}
                                                                onChange={(e) => setHealthForm({...healthForm, medications: e.target.value.split(",").map(s => s.trim()).filter(Boolean)})}
                                                                placeholder="Metformin, Lisinopril"
                                                            />
                                                        </div>
                                                        <div>
                                                            <Label>Supplements (comma-separated)</Label>
                                                            <Input
                                                                value={healthForm.supplements.join(", ")}
                                                                onChange={(e) => setHealthForm({...healthForm, supplements: e.target.value.split(",").map(s => s.trim()).filter(Boolean)})}
                                                                placeholder="Vitamin D, Magnesium"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="mt-4">
                                                        <Label>Surgeries / Medical Procedures</Label>
                                                        <Textarea
                                                            value={healthForm.surgeries}
                                                            onChange={(e) => setHealthForm({...healthForm, surgeries: e.target.value})}
                                                            placeholder="List any surgeries or major medical procedures"
                                                            rows={2}
                                                        />
                                                    </div>
                                                    <div className="mt-4">
                                                        <Label>Family History</Label>
                                                        <Textarea
                                                            value={healthForm.familyHistory}
                                                            onChange={(e) => setHealthForm({...healthForm, familyHistory: e.target.value})}
                                                            placeholder="Relevant family medical history"
                                                            rows={2}
                                                        />
                                                    </div>
                                                </div>

                                                {/* Lifestyle */}
                                                <div>
                                                    <h4 className="font-semibold text-gray-900 mb-3">Lifestyle</h4>
                                                    <div className="grid md:grid-cols-4 gap-4">
                                                        <div>
                                                            <Label>Diet Type</Label>
                                                            <Select value={healthForm.dietType} onValueChange={(v) => setHealthForm({...healthForm, dietType: v})}>
                                                                <SelectTrigger><SelectValue placeholder="Select diet" /></SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="Standard">Standard</SelectItem>
                                                                    <SelectItem value="Vegetarian">Vegetarian</SelectItem>
                                                                    <SelectItem value="Vegan">Vegan</SelectItem>
                                                                    <SelectItem value="Keto">Keto</SelectItem>
                                                                    <SelectItem value="Paleo">Paleo</SelectItem>
                                                                    <SelectItem value="Mediterranean">Mediterranean</SelectItem>
                                                                    <SelectItem value="Gluten-Free">Gluten-Free</SelectItem>
                                                                    <SelectItem value="Low-FODMAP">Low-FODMAP</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                        <div>
                                                            <Label>Sleep Hours</Label>
                                                            <Input
                                                                type="number"
                                                                min="0"
                                                                max="24"
                                                                value={healthForm.sleepHours}
                                                                onChange={(e) => setHealthForm({...healthForm, sleepHours: parseInt(e.target.value) || 0})}
                                                            />
                                                        </div>
                                                        <div>
                                                            <Label>Exercise Frequency</Label>
                                                            <Select value={healthForm.exerciseFreq} onValueChange={(v) => setHealthForm({...healthForm, exerciseFreq: v})}>
                                                                <SelectTrigger><SelectValue placeholder="Select frequency" /></SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="None">None</SelectItem>
                                                                    <SelectItem value="1-2x/week">1-2x/week</SelectItem>
                                                                    <SelectItem value="3-4x/week">3-4x/week</SelectItem>
                                                                    <SelectItem value="5-6x/week">5-6x/week</SelectItem>
                                                                    <SelectItem value="Daily">Daily</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                        <div>
                                                            <Label>Stress Level</Label>
                                                            <Select value={healthForm.stressLevel} onValueChange={(v) => setHealthForm({...healthForm, stressLevel: v})}>
                                                                <SelectTrigger><SelectValue placeholder="Select level" /></SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="Low">Low</SelectItem>
                                                                    <SelectItem value="Moderate">Moderate</SelectItem>
                                                                    <SelectItem value="High">High</SelectItem>
                                                                    <SelectItem value="Very High">Very High</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Personal Info */}
                                                <div>
                                                    <h4 className="font-semibold text-gray-900 mb-3">Personal Information</h4>
                                                    <div className="grid md:grid-cols-3 gap-4">
                                                        <div>
                                                            <Label>Date of Birth</Label>
                                                            <Input
                                                                type="date"
                                                                value={healthForm.dateOfBirth}
                                                                onChange={(e) => setHealthForm({...healthForm, dateOfBirth: e.target.value})}
                                                            />
                                                        </div>
                                                        <div>
                                                            <Label>Gender</Label>
                                                            <Select value={healthForm.gender} onValueChange={(v) => setHealthForm({...healthForm, gender: v})}>
                                                                <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="Female">Female</SelectItem>
                                                                    <SelectItem value="Male">Male</SelectItem>
                                                                    <SelectItem value="Non-binary">Non-binary</SelectItem>
                                                                    <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                        <div>
                                                            <Label>Occupation</Label>
                                                            <Input
                                                                value={healthForm.occupation}
                                                                onChange={(e) => setHealthForm({...healthForm, occupation: e.target.value})}
                                                                placeholder="Current occupation"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </TabsContent>

                                {/* Sessions Tab */}
                                <TabsContent value="sessions" className="mt-6">
                                    <div className="bg-white rounded-2xl border border-gray-100 p-6">
                                        <div className="flex items-center justify-between mb-6">
                                            <h3 className="font-bold text-gray-900">Session History</h3>
                                            <Button size="sm" onClick={() => setShowAddSession(true)} className="bg-burgundy-600 hover:bg-burgundy-700">
                                                <Plus className="w-4 h-4 mr-2" /> Log Session
                                            </Button>
                                        </div>
                                        {selectedClient.sessions.length > 0 ? (
                                            <div className="space-y-3">
                                                {selectedClient.sessions.map((session, i) => (
                                                    <div key={session.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl group">
                                                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center border border-gray-100">
                                                            <Calendar className="w-5 h-5 text-gray-400" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <p className="font-medium text-gray-900">{session.sessionType || `Session #${selectedClient.sessions.length - i}`}</p>
                                                            <p className="text-sm text-gray-500">{new Date(session.date).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</p>
                                                            {session.notes && <p className="text-sm text-gray-600 mt-1 line-clamp-1">{session.notes}</p>}
                                                        </div>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-opacity"
                                                            onClick={async () => {
                                                                if (!confirm("Delete this session?")) return;
                                                                try {
                                                                    await fetch(`/api/coach/clients/${selectedClient.id}/sessions?itemId=${session.id}`, {
                                                                        method: "DELETE",
                                                                    });
                                                                    setSelectedClient(prev => prev ? {
                                                                        ...prev,
                                                                        sessions: prev.sessions.filter(s => s.id !== session.id),
                                                                        _count: { ...prev._count, sessions: prev._count.sessions - 1 }
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
                                                <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                                <p className="text-gray-500 mb-4">No sessions recorded yet</p>
                                                <Button onClick={() => setShowAddSession(true)}>Log First Session</Button>
                                            </div>
                                        )}
                                    </div>
                                </TabsContent>

                                {/* Progress Tab */}
                                <TabsContent value="progress" className="mt-6">
                                    <div className="space-y-6">
                                        {/* Progress Overview Cards - Based on Real Assessments */}
                                        {selectedClient.assessments && selectedClient.assessments.length > 0 ? (
                                            <div className="grid md:grid-cols-4 gap-4">
                                                {(() => {
                                                    const assessments = selectedClient.assessments || [];
                                                    const types = ["Energy", "Sleep", "Stress", "Mood"];
                                                    const icons: Record<string, string> = { Energy: "⚡", Sleep: "😴", Stress: "🧘", Mood: "😊" };
                                                    return types.map((type) => {
                                                        const typeAssessments = assessments.filter((a: any) => a.type === type).sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
                                                        const current = typeAssessments[0]?.score || 0;
                                                        const previous = typeAssessments[1]?.score || current;
                                                        const isInverse = type === "Stress";
                                                        return (
                                                            <div key={type} className="bg-white rounded-xl border border-gray-100 p-4">
                                                                <div className="flex items-center gap-2 mb-2">
                                                                    <span className="text-xl">{icons[type]}</span>
                                                                    <span className="text-sm text-gray-600">{type}</span>
                                                                </div>
                                                                <p className="text-3xl font-bold text-gray-900">{current}/10</p>
                                                                {typeAssessments.length > 1 && (
                                                                    <p className={cn("text-xs mt-1", isInverse ? (current < previous ? "text-green-600" : "text-red-600") : (current > previous ? "text-green-600" : "text-red-600"))}>
                                                                        {isInverse ? (current < previous ? "↓" : "↑") : (current > previous ? "↑" : "↓")} {Math.abs(current - previous)} from last
                                                                    </p>
                                                                )}
                                                            </div>
                                                        );
                                                    });
                                                })()}
                                            </div>
                                        ) : (
                                            <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-100 p-8 text-center">
                                                <Activity className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                                <h3 className="font-semibold text-gray-700 mb-2">No Assessments Yet</h3>
                                                <p className="text-sm text-gray-500 mb-4">Log your first assessment below to start tracking progress</p>
                                            </div>
                                        )}

                                        {/* Progress Chart Visualization */}
                                        <div className="bg-white rounded-2xl border border-gray-100 p-6">
                                            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><TrendingUp className="w-5 h-5 text-burgundy-500" />Progress Over Time (Based on Sessions)</h3>
                                            <div className="space-y-4">
                                                {/* Session-based progress - each session = ~15% progress */}
                                                {selectedClient.sessions.length > 0 ? (
                                                    selectedClient.sessions.slice(0, 6).map((session, i) => {
                                                        const progress = Math.min((i + 1) * 15, 100);
                                                        return (
                                                            <div key={session.id} className="flex items-center gap-4">
                                                                <span className="text-xs text-gray-500 w-20">Session {i + 1}</span>
                                                                <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
                                                                    <div
                                                                        className="h-full bg-gradient-to-r from-burgundy-400 to-burgundy-600 rounded-full transition-all"
                                                                        style={{ width: `${progress}%` }}
                                                                    />
                                                                </div>
                                                                <span className="text-sm font-medium w-12 text-right">{progress}%</span>
                                                            </div>
                                                        );
                                                    })
                                                ) : (
                                                    <div className="text-center py-6">
                                                        <TrendingUp className="w-10 h-10 mx-auto mb-2 text-gray-200" />
                                                        <p className="text-sm text-gray-400">Log sessions to see progress</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-6">
                                            {/* Milestones */}
                                            <div className="bg-white rounded-2xl border border-gray-100 p-6">
                                                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">🏆 Milestones Achieved</h3>
                                                <div className="space-y-3">
                                                    {[
                                                        { title: "Completed Intake Forms", date: "Dec 1", icon: "📋", done: true },
                                                        { title: "First 7 Days of Protocol", date: "Dec 7", icon: "🌟", done: true },
                                                        { title: "30-Day Check-in", date: "Dec 15", icon: "📊", done: false },
                                                        { title: "Protocol Completion", date: "Dec 28", icon: "🎉", done: false },
                                                    ].map((milestone, i) => (
                                                        <div key={i} className={cn("flex items-center gap-3 p-3 rounded-xl", milestone.done ? "bg-burgundy-50" : "bg-gray-50")}>
                                                            <div className={cn("w-8 h-8 rounded-full flex items-center justify-center", milestone.done ? "bg-burgundy-100" : "bg-gray-200")}>
                                                                {milestone.done ? <Check className="w-4 h-4 text-burgundy-600" /> : <span className="text-xs text-gray-500">{i + 1}</span>}
                                                            </div>
                                                            <div className="flex-1">
                                                                <p className={cn("text-sm font-medium", milestone.done ? "text-burgundy-900" : "text-gray-700")}>{milestone.title}</p>
                                                                <p className="text-xs text-gray-500">{milestone.date}</p>
                                                            </div>
                                                            <span className="text-lg">{milestone.icon}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Add Assessment */}
                                            <div className="bg-white rounded-2xl border border-gray-100 p-6">
                                                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">📝 Log Assessment</h3>
                                                <div className="space-y-4">
                                                    <div>
                                                        <label className="text-sm font-medium text-gray-700 mb-2 block">Assessment Type</label>
                                                        <div className="grid grid-cols-2 gap-2">
                                                            {["Energy", "Sleep", "Stress", "Mood", "Digestion", "Pain"].map((type) => (
                                                                <Button
                                                                    key={type}
                                                                    variant={assessmentType === type ? "default" : "outline"}
                                                                    size="sm"
                                                                    className={cn("justify-start", assessmentType === type && "bg-burgundy-600 text-white")}
                                                                    onClick={() => setAssessmentType(type)}
                                                                >
                                                                    {type}
                                                                </Button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <label className="text-sm font-medium text-gray-700 mb-2 block">Score (1-10)</label>
                                                        <div className="flex gap-1">
                                                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                                                                <button
                                                                    key={n}
                                                                    className={cn(
                                                                        "w-8 h-8 rounded-lg border text-sm font-medium transition-colors",
                                                                        assessmentScore === n
                                                                            ? "bg-burgundy-600 border-burgundy-600 text-white"
                                                                            : "border-gray-200 hover:bg-burgundy-50 hover:border-burgundy-300"
                                                                    )}
                                                                    onClick={() => setAssessmentScore(n)}
                                                                >
                                                                    {n}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <Button
                                                        className="w-full bg-burgundy-600 hover:bg-burgundy-700"
                                                        disabled={!assessmentType || !assessmentScore || savingAssessment}
                                                        onClick={async () => {
                                                            if (!assessmentType || !assessmentScore) {
                                                                toast.error("Please select type and score");
                                                                return;
                                                            }
                                                            setSavingAssessment(true);
                                                            try {
                                                                const res = await fetch(`/api/coach/clients/${selectedClient.id}/assessments`, {
                                                                    method: "POST",
                                                                    headers: { "Content-Type": "application/json" },
                                                                    body: JSON.stringify({
                                                                        type: assessmentType,
                                                                        score: assessmentScore,
                                                                        date: new Date().toISOString(),
                                                                    }),
                                                                });
                                                                const data = await res.json();
                                                                if (data.success) {
                                                                    const newAssessment = { id: Date.now().toString(), type: assessmentType, score: assessmentScore, date: new Date().toISOString() };
                                                                    setSelectedClient(prev => prev ? {
                                                                        ...prev,
                                                                        assessments: [...(prev.assessments || []), newAssessment]
                                                                    } : null);
                                                                    setAssessmentType("");
                                                                    setAssessmentScore(0);
                                                                    toast.success("Assessment saved!");
                                                                } else {
                                                                    toast.error(data.error || "Failed to save assessment");
                                                                }
                                                            } catch (error) {
                                                                console.error("Save assessment error:", error);
                                                                toast.error("Failed to save assessment");
                                                            } finally {
                                                                setSavingAssessment(false);
                                                            }
                                                        }}
                                                    >
                                                        {savingAssessment ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
                                                        Save Assessment
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Before/After Tracking */}
                                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-100 p-6">
                                            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">📸 Before & After Comparison</h3>
                                            <div className="grid md:grid-cols-2 gap-6">
                                                <div className="text-center">
                                                    <div className="bg-white rounded-xl p-8 border-2 border-dashed border-gray-300 mb-2">
                                                        <p className="text-gray-400 text-sm">Before Photo</p>
                                                        <p className="text-xs text-gray-400 mt-1">(Click to upload)</p>
                                                    </div>
                                                    <p className="text-xs text-gray-500">Start Date: {selectedClient.startDate ? new Date(selectedClient.startDate).toLocaleDateString() : "N/A"}</p>
                                                </div>
                                                <div className="text-center">
                                                    <div className="bg-white rounded-xl p-8 border-2 border-dashed border-gray-300 mb-2">
                                                        <p className="text-gray-400 text-sm">Current Photo</p>
                                                        <p className="text-xs text-gray-400 mt-1">(Click to upload)</p>
                                                    </div>
                                                    <p className="text-xs text-gray-500">Today: {new Date().toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </TabsContent>

                                {/* Protocols Tab */}
                                <TabsContent value="protocols" className="mt-6">
                                    <div className="bg-white rounded-2xl border border-gray-100 p-6">
                                        <div className="flex items-center justify-between mb-6">
                                            <h3 className="font-bold text-gray-900">Protocol Library</h3>
                                            <Button size="sm" onClick={() => setShowAssignProtocol(true)} className="bg-burgundy-600 hover:bg-burgundy-700">
                                                <Plus className="w-4 h-4 mr-2" /> Assign Protocol
                                            </Button>
                                        </div>

                                        {selectedClient.protocols.length > 0 && (
                                            <div className="mb-6">
                                                <h4 className="text-sm font-medium text-gray-700 mb-3">Assigned to {selectedClient.name}</h4>
                                                <div className="space-y-2">
                                                    {selectedClient.protocols.map((p) => (
                                                        <div key={p.id} className="flex items-center gap-4 p-4 bg-burgundy-50 rounded-xl border border-burgundy-100">
                                                            <ClipboardList className="w-6 h-6 text-burgundy-600" />
                                                            <div className="flex-1">
                                                                <p className="font-medium text-gray-900">{p.name}</p>
                                                            </div>
                                                            <Badge className="bg-burgundy-100 text-burgundy-700">{p.status}</Badge>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        <h4 className="text-sm font-medium text-gray-700 mb-3">Available Protocols</h4>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            {PROTOCOL_TEMPLATES.map((p) => (
                                                <div key={p.id} className="p-5 border border-gray-100 rounded-xl hover:border-purple-200 hover:shadow-md transition-all bg-gradient-to-br from-white to-gray-50">
                                                    <div className="flex items-start gap-3 mb-3">
                                                        <span className="text-3xl">{p.icon}</span>
                                                        <div className="flex-1">
                                                            <p className="font-semibold text-gray-900">{p.name}</p>
                                                            <p className="text-xs text-purple-600 font-medium">{p.category} • {p.weeks} weeks</p>
                                                        </div>
                                                    </div>
                                                    <p className="text-sm text-gray-600 mb-3">{p.description}</p>

                                                    {/* Focus Areas */}
                                                    <div className="mb-3">
                                                        <p className="text-xs font-medium text-gray-500 mb-1">Focus Areas:</p>
                                                        <div className="flex flex-wrap gap-1">
                                                            {p.focus.slice(0, 3).map((f, i) => (
                                                                <span key={i} className="text-xs px-2 py-0.5 bg-purple-50 text-purple-700 rounded-full">{f}</span>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    {/* Phases Preview */}
                                                    <div className="mb-3">
                                                        <p className="text-xs font-medium text-gray-500 mb-1">Weekly Phases:</p>
                                                        <div className="flex gap-1">
                                                            {p.phases.map((phase, i) => (
                                                                <div key={i} className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-600" title={phase.title}>
                                                                    {phase.week}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    {/* Supplements */}
                                                    <div className="mb-3">
                                                        <p className="text-xs font-medium text-gray-500 mb-1">Key Supplements:</p>
                                                        <p className="text-xs text-gray-600">{p.supplements.slice(0, 3).join(", ")}{p.supplements.length > 3 ? "..." : ""}</p>
                                                    </div>

                                                    <Button size="sm" onClick={() => { setSelectedProtocol(p); setShowAssignProtocol(true); }} className="w-full bg-purple-600 hover:bg-purple-700">
                                                        Assign to Client <ChevronRight className="w-3 h-3 ml-1" />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </TabsContent>

                                {/* Packages Tab - MONETIZATION */}
                                <TabsContent value="packages" className="mt-6">
                                    <div className="bg-white rounded-2xl border border-gray-100 p-6">
                                        <div className="flex items-center justify-between mb-6">
                                            <div>
                                                <h3 className="font-bold text-gray-900">Coaching Packages</h3>
                                                <p className="text-sm text-gray-500">Offer your client a coaching package or program</p>
                                            </div>
                                        </div>

                                        {selectedClient.packageType && (
                                            <div className="mb-6 p-4 bg-burgundy-50 rounded-xl border border-burgundy-100">
                                                <p className="text-xs font-medium text-burgundy-600 mb-1">Current Package</p>
                                                <p className="font-semibold text-burgundy-900">{selectedClient.packageType}</p>
                                            </div>
                                        )}

                                        <div className="grid md:grid-cols-3 gap-4">
                                            {/* 1:1 Coaching */}
                                            <div className="p-5 border-2 border-blue-200 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 hover:shadow-lg transition-all">
                                                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                                                    <Users className="w-6 h-6 text-blue-600" />
                                                </div>
                                                <h4 className="font-bold text-gray-900 mb-1">1:1 Coaching</h4>
                                                <p className="text-sm text-gray-600 mb-3">Private personalized coaching sessions</p>
                                                <div className="space-y-1 mb-4 text-xs text-gray-500">
                                                    <p>✓ Weekly 45-min sessions</p>
                                                    <p>✓ Personalized protocols</p>
                                                    <p>✓ Direct chat support</p>
                                                </div>
                                                <div className="flex items-baseline gap-1 mb-3">
                                                    <span className="text-2xl font-bold text-blue-600">$497</span>
                                                    <span className="text-sm text-gray-500">/month</span>
                                                </div>
                                                <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={() => toast.success(`Package offered to ${selectedClient.name}!`)}>
                                                    Offer Package
                                                </Button>
                                            </div>

                                            {/* Group Coaching */}
                                            <div className="p-5 border-2 border-purple-200 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 hover:shadow-lg transition-all relative">
                                                <Badge className="absolute top-3 right-3 bg-purple-600 text-white border-0 text-xs">Popular</Badge>
                                                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                                                    <Heart className="w-6 h-6 text-purple-600" />
                                                </div>
                                                <h4 className="font-bold text-gray-900 mb-1">Group Coaching</h4>
                                                <p className="text-sm text-gray-600 mb-3">Community with live group calls</p>
                                                <div className="space-y-1 mb-4 text-xs text-gray-500">
                                                    <p>✓ Weekly group calls</p>
                                                    <p>✓ Private community</p>
                                                    <p>✓ Peer support</p>
                                                </div>
                                                <div className="flex items-baseline gap-1 mb-3">
                                                    <span className="text-2xl font-bold text-purple-600">$197</span>
                                                    <span className="text-sm text-gray-500">/month</span>
                                                </div>
                                                <Button className="w-full bg-purple-600 hover:bg-purple-700" onClick={() => toast.success(`Package offered to ${selectedClient.name}!`)}>
                                                    Offer Package
                                                </Button>
                                            </div>

                                            {/* Program */}
                                            <div className="p-5 border-2 border-burgundy-200 rounded-xl bg-gradient-to-br from-burgundy-50 to-burgundy-100/50 hover:shadow-lg transition-all">
                                                <div className="w-12 h-12 bg-burgundy-100 rounded-xl flex items-center justify-center mb-4">
                                                    <Target className="w-6 h-6 text-burgundy-600" />
                                                </div>
                                                <h4 className="font-bold text-gray-900 mb-1">8-Week Program</h4>
                                                <p className="text-sm text-gray-600 mb-3">Complete transformation program</p>
                                                <div className="space-y-1 mb-4 text-xs text-gray-500">
                                                    <p>✓ 8 recorded modules</p>
                                                    <p>✓ Workbooks & guides</p>
                                                    <p>✓ 2x monthly 1:1 calls</p>
                                                </div>
                                                <div className="flex items-baseline gap-1 mb-3">
                                                    <span className="text-2xl font-bold text-burgundy-600">$997</span>
                                                    <span className="text-sm text-gray-500">one-time</span>
                                                </div>
                                                <Button className="w-full bg-burgundy-600 hover:bg-burgundy-700" onClick={() => toast.success(`Package offered to ${selectedClient.name}!`)}>
                                                    Offer Package
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="mt-6 p-4 bg-amber-50 rounded-xl border border-amber-100">
                                            <p className="text-xs text-amber-800">
                                                <strong>💳 Stripe Integration Coming:</strong> Connect Stripe to accept payments directly.
                                            </p>
                                        </div>
                                    </div>
                                </TabsContent>

                                {/* Tasks Tab */}
                                <TabsContent value="tasks" className="mt-6">
                                    <div className="bg-white rounded-2xl border border-gray-100 p-6">
                                        <div className="flex items-center justify-between mb-6">
                                            <h3 className="font-bold text-gray-900">Client Tasks</h3>
                                            <Button size="sm" onClick={() => setShowAddTask(true)} className="bg-burgundy-600 hover:bg-burgundy-700">
                                                <Plus className="w-4 h-4 mr-2" /> Add Task
                                            </Button>
                                        </div>
                                        {selectedClient.tasks.length > 0 ? (
                                            <div className="space-y-3">
                                                {selectedClient.tasks.map((task) => (
                                                    <div key={task.id} className="flex items-center gap-4 p-4 border border-gray-100 rounded-xl">
                                                        <button onClick={() => handleCompleteTask(task.id)} className="w-6 h-6 rounded-full border-2 border-gray-300 hover:border-burgundy-500 hover:bg-burgundy-50 transition-colors flex items-center justify-center">
                                                            <Check className="w-3 h-3 text-transparent hover:text-burgundy-500" />
                                                        </button>
                                                        <div className="flex-1">
                                                            <p className="font-medium text-gray-900">{task.task}</p>
                                                            {task.dueDate && <p className="text-xs text-gray-500">Due: {new Date(task.dueDate).toLocaleDateString()}</p>}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-12">
                                                <CheckSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                                <p className="text-gray-500 mb-4">No tasks assigned</p>
                                                <Button onClick={() => setShowAddTask(true)}>Add First Task</Button>
                                            </div>
                                        )}
                                    </div>
                                </TabsContent>

                                {/* Notes Tab - ENHANCED */}
                                <TabsContent value="notes" className="mt-6">
                                    <div className="grid md:grid-cols-3 gap-6">
                                        {/* Main Notes Area */}
                                        <div className="md:col-span-2 bg-white rounded-2xl border border-gray-100 p-6">
                                            <div className="flex items-center justify-between mb-4">
                                                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                                    <Edit className="w-5 h-5 text-blue-500" /> Session Notes & Observations
                                                </h3>
                                                <span className="text-xs text-gray-400">Auto-saved • Last updated: {new Date().toLocaleDateString()}</span>
                                            </div>

                                            {/* SOAP Notes Guide */}
                                            <div className="mb-4 p-3 bg-blue-50 rounded-xl border border-blue-100">
                                                <p className="text-xs font-semibold text-blue-800 mb-2">📝 SOAP Notes Format (Recommended)</p>
                                                <div className="grid grid-cols-4 gap-2 text-xs text-blue-700">
                                                    <div><span className="font-bold">S</span>ubjective - Client's own words</div>
                                                    <div><span className="font-bold">O</span>bjective - Observable facts</div>
                                                    <div><span className="font-bold">A</span>ssessment - Your analysis</div>
                                                    <div><span className="font-bold">P</span>lan - Next steps</div>
                                                </div>
                                            </div>

                                            <Textarea
                                                value={clientNotes}
                                                onChange={(e) => setClientNotes(e.target.value)}
                                                placeholder={`SUBJECTIVE:
Client reports feeling more energetic this week. Sleep improved from 5 to 7 hours. Still experiencing some morning brain fog.

OBJECTIVE:
Weight: 165 lbs (-2 lbs from last week)
Energy score: 6/10 (up from 4/10)
Completed 4/5 assigned tasks

ASSESSMENT:
Protocol is showing positive results. Sleep improvements correlating with energy gains. Brain fog may be related to blood sugar fluctuations in AM.

PLAN:
- Continue current protocol week 3
- Add protein to breakfast to stabilize blood sugar
- Schedule follow-up in 1 week
- Assign food diary for 3 days`}
                                                className="min-h-[400px] font-mono text-sm"
                                            />
                                            <div className="flex justify-between items-center mt-4">
                                                <p className="text-xs text-gray-400">{clientNotes.length} characters</p>
                                                <Button onClick={handleSaveNotes} disabled={saving} className="bg-burgundy-600 hover:bg-burgundy-700">
                                                    {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Check className="w-4 h-4 mr-2" />}
                                                    Save Notes
                                                </Button>
                                            </div>
                                        </div>

                                        {/* Quick Reference Sidebar */}
                                        <div className="space-y-4">
                                            {/* Client Quick Info */}
                                            <div className="bg-white rounded-2xl border border-gray-100 p-4">
                                                <h4 className="font-semibold text-gray-900 mb-3 text-sm">Client Snapshot</h4>
                                                <div className="space-y-2 text-sm">
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-500">Status</span>
                                                        <Badge className={getStatusColor(selectedClient.status)}>{selectedClient.status}</Badge>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-500">Sessions</span>
                                                        <span className="font-medium">{selectedClient._count.sessions}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-500">Active Tasks</span>
                                                        <span className="font-medium">{selectedClient.tasks.length}</span>
                                                    </div>
                                                    {selectedClient.protocols.length > 0 && (
                                                        <div className="flex justify-between">
                                                            <span className="text-gray-500">Protocol</span>
                                                            <span className="font-medium text-xs truncate max-w-[120px]">{selectedClient.protocols[0]?.name}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Quick Add Templates */}
                                            <div className="bg-white rounded-2xl border border-gray-100 p-4">
                                                <h4 className="font-semibold text-gray-900 mb-3 text-sm">Quick Add to Notes</h4>
                                                <div className="space-y-2">
                                                    {[
                                                        { label: "Progress Update", template: "\n\n📈 PROGRESS UPDATE (" + new Date().toLocaleDateString() + ")\n- Energy: /10\n- Sleep: /10\n- Mood: /10\n- Compliance: %\n" },
                                                        { label: "Follow-up Action", template: "\n\n⚡ FOLLOW-UP ACTION\n- [ ] \n- [ ] \n" },
                                                        { label: "Red Flag", template: "\n\n🚨 RED FLAG NOTED:\n" },
                                                        { label: "Breakthrough", template: "\n\n🎉 BREAKTHROUGH:\n" },
                                                    ].map((t) => (
                                                        <Button
                                                            key={t.label}
                                                            size="sm"
                                                            variant="outline"
                                                            className="w-full justify-start text-xs"
                                                            onClick={() => setClientNotes(prev => prev + t.template)}
                                                        >
                                                            {t.label}
                                                        </Button>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Health Conditions Reference */}
                                            {selectedClient.conditions && selectedClient.conditions.length > 0 && (
                                                <div className="bg-white rounded-2xl border border-gray-100 p-4">
                                                    <h4 className="font-semibold text-gray-900 mb-3 text-sm">Conditions</h4>
                                                    <div className="flex flex-wrap gap-1">
                                                        {selectedClient.conditions.map((c, i) => (
                                                            <Badge key={i} variant="outline" className="text-xs">{c}</Badge>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Medications Reference */}
                                            {selectedClient.medications && selectedClient.medications.length > 0 && (
                                                <div className="bg-white rounded-2xl border border-gray-100 p-4">
                                                    <h4 className="font-semibold text-gray-900 mb-3 text-sm">Medications</h4>
                                                    <div className="flex flex-wrap gap-1">
                                                        {selectedClient.medications.map((m, i) => (
                                                            <Badge key={i} variant="outline" className="text-xs bg-orange-50 text-orange-700 border-orange-200">{m}</Badge>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </div>
                    ) : (
                        /* FULL DASHBOARD - When No Client Selected */
                        <div className="space-y-6">
                            {/* Quick Stats Row */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {[
                                    { label: "Total Clients", value: clients.length, icon: Users, color: "blue" },
                                    { label: "Active Protocols", value: clients.filter(c => c.protocols.length > 0).length, icon: ClipboardList, color: "purple" },
                                    { label: "Pending Tasks", value: clients.reduce((sum, c) => sum + c.tasks.length, 0), icon: CheckSquare, color: "orange" },
                                    { label: "Sessions This Week", value: stats.thisWeekSessions, icon: Calendar, color: "green" },
                                ].map((stat) => (
                                    <div key={stat.label} className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-shadow">
                                        <stat.icon className={`w-5 h-5 text-${stat.color}-500 mb-2`} />
                                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                                        <p className="text-xs text-gray-500">{stat.label}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Dashboard Navigation Bar */}
                            <Tabs defaultValue="my-profile" className="w-full">
                                <div className="bg-white rounded-xl border border-gray-200 p-2 mb-6">
                                    <div className="flex items-center justify-between gap-4">
                                        {/* Tabs - Simplified for core features */}
                                        <div className="flex-1 overflow-x-auto">
                                            <TabsList className="bg-gray-50 p-1 rounded-lg inline-flex min-w-max">
                                                <TabsTrigger value="my-profile" className="rounded-md px-3 py-2 text-sm"><UserCircle className="w-4 h-4 mr-1.5" />My Profile</TabsTrigger>
                                                <TabsTrigger value="overview" className="rounded-md px-3 py-2 text-sm"><Activity className="w-4 h-4 mr-1.5" />Dashboard</TabsTrigger>
                                                <TabsTrigger value="emails" className="rounded-md px-3 py-2 text-sm"><Mail className="w-4 h-4 mr-1.5" />Email Templates</TabsTrigger>
                                                <TabsTrigger value="programs" className="rounded-md px-3 py-2 text-sm"><ClipboardList className="w-4 h-4 mr-1.5" />Programs</TabsTrigger>
                                                <TabsTrigger value="availability" className="rounded-md px-3 py-2 text-sm"><Calendar className="w-4 h-4 mr-1.5" />Availability</TabsTrigger>
                                            </TabsList>
                                        </div>
                                        {/* Actions */}
                                        <div className="flex items-center gap-2 flex-shrink-0">
                                            <div className="relative hidden sm:block">
                                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                <Input
                                                    placeholder="Search..."
                                                    value={searchQuery}
                                                    onChange={(e) => setSearchQuery(e.target.value)}
                                                    className="pl-9 w-[140px] h-9 text-sm"
                                                />
                                            </div>
                                            <Button onClick={() => setShowAddClient(true)} size="sm" className="bg-burgundy-600 hover:bg-burgundy-700 text-white font-medium h-9">
                                                <Plus className="w-4 h-4 mr-1" /> Add Client
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                                {/* Overview Tab */}
                                <TabsContent value="overview" className="mt-6">
                                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {/* Today's Sessions */}
                                        <div className="bg-white rounded-2xl border border-gray-100 p-5">
                                            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><Calendar className="w-5 h-5 text-blue-500" />Today's Sessions</h3>
                                            {clients.filter(c => c.sessions.length > 0).slice(0, 3).map((client) => (
                                                <div key={client.id} className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl mb-2">
                                                    <Avatar className="h-9 w-9">
                                                        <AvatarFallback className="bg-blue-100 text-blue-700 text-xs">{getInitials(client.name)}</AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex-1">
                                                        <p className="font-medium text-sm">{client.name}</p>
                                                        <p className="text-xs text-gray-500">Session scheduled</p>
                                                    </div>
                                                    <Button size="sm" variant="ghost" onClick={() => setSelectedClient(client)}>View</Button>
                                                </div>
                                            ))}
                                            {clients.length === 0 && <p className="text-sm text-gray-400 text-center py-4">No sessions today</p>}
                                        </div>

                                        {/* Action Items */}
                                        <div className="bg-white rounded-2xl border border-gray-100 p-5">
                                            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><Zap className="w-5 h-5 text-orange-500" />Action Items</h3>
                                            <div className="space-y-2">
                                                {clients.filter(c => c.tasks.length > 0).slice(0, 3).map((client) => (
                                                    <div key={client.id} className="flex items-center gap-3 p-3 bg-orange-50 rounded-xl">
                                                        <div className="w-2 h-2 bg-orange-500 rounded-full" />
                                                        <p className="text-sm flex-1"><span className="font-medium">{client.name}</span> has {client.tasks.length} pending tasks</p>
                                                    </div>
                                                ))}
                                                {clients.filter(c => c.protocols.length === 0).slice(0, 2).map((client) => (
                                                    <div key={client.id} className="flex items-center gap-3 p-3 bg-purple-50 rounded-xl">
                                                        <div className="w-2 h-2 bg-purple-500 rounded-full" />
                                                        <p className="text-sm flex-1"><span className="font-medium">{client.name}</span> needs a protocol assigned</p>
                                                    </div>
                                                ))}
                                                {clients.length === 0 && <p className="text-sm text-gray-400 text-center py-4">No action items</p>}
                                            </div>
                                        </div>

                                        {/* Coaching Tip */}
                                        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-100 p-5">
                                            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">💡 Coaching Tip</h3>
                                            <p className="text-sm text-gray-700 mb-3">
                                                "The most powerful coaching question is: 'What would make the biggest difference for you right now?'"
                                            </p>
                                            <p className="text-xs text-amber-700">— ICF Core Competency: Evokes Awareness</p>
                                        </div>

                                        {/* Client Progress */}
                                        <div className="bg-white rounded-2xl border border-gray-100 p-5 md:col-span-2">
                                            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><TrendingUp className="w-5 h-5 text-burgundy-500" />Client Progress Overview</h3>
                                            <div className="grid grid-cols-3 gap-4">
                                                {clients.slice(0, 6).map((client) => (
                                                    <button key={client.id} onClick={() => setSelectedClient(client)} className="text-left p-3 border border-gray-100 rounded-xl hover:border-burgundy-200 transition-colors">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <Avatar className="h-7 w-7"><AvatarFallback className="text-xs bg-burgundy-100 text-burgundy-700">{getInitials(client.name)}</AvatarFallback></Avatar>
                                                            <p className="font-medium text-sm truncate">{client.name}</p>
                                                        </div>
                                                        <Progress value={Math.min(client._count.sessions * 15, 100)} className="h-1.5" />
                                                        <p className="text-xs text-gray-500 mt-1">{client._count.sessions} sessions</p>
                                                    </button>
                                                ))}
                                            </div>
                                            {clients.length === 0 && <p className="text-sm text-gray-400 text-center py-8">Add clients to see progress</p>}
                                        </div>

                                        {/* Quick Actions */}
                                        <div className="bg-white rounded-2xl border border-gray-100 p-5">
                                            <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
                                            <div className="space-y-2">
                                                <Button variant="outline" className="w-full justify-start" onClick={() => setShowAddClient(true)}>
                                                    <Plus className="w-4 h-4 mr-2" /> Add New Client
                                                </Button>
                                                <a href="/messages" className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                                    <MessageSquare className="w-4 h-4" /> Check Messages
                                                </a>
                                                <a href="/settings" className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                                    <Users className="w-4 h-4" /> My Coach Profile
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </TabsContent>

                                {/* Email Templates Tab */}
                                {/* Email Templates Tab - FULL TEMPLATES */}
                                <TabsContent value="emails" className="mt-6">
                                    <div className="bg-white rounded-2xl border border-gray-100 p-6">
                                        <h3 className="font-bold text-gray-900 mb-2">Email Templates</h3>
                                        <p className="text-sm text-gray-500 mb-6">Click any template to expand and copy the full text</p>
                                        <div className="space-y-4">
                                            {[
                                                {
                                                    id: "welcome",
                                                    title: "🎉 Welcome Email",
                                                    desc: "Onboard new clients",
                                                    fullText: `Subject: Welcome to Your Transformation Journey! 🌟

Hi [Client Name],

I'm so excited to officially welcome you to our coaching journey together!

Over the next [X weeks/months], we'll work together to help you achieve [specific goal]. I'm here to guide, support, and celebrate every step of your progress.

Here's what to expect next:
• You'll receive your intake forms within 24 hours
• Our first session is scheduled for [Date/Time]
• Please complete the health history questionnaire before our call

If you have any questions before our first session, don't hesitate to reach out.

Can't wait to get started!

Warmly,
[Your Name]
[Your Title/Certification]`
                                                },
                                                {
                                                    id: "reminder",
                                                    title: "📅 Session Reminder",
                                                    desc: "24-hour reminder",
                                                    fullText: `Subject: Reminder: Our Session Tomorrow at [Time]

Hi [Client Name],

Just a friendly reminder that we have our coaching session scheduled for tomorrow at [Time].

Please come prepared with:
• Updates on your progress this week
• Any challenges you'd like to discuss
• Questions about your current protocol

If you need to reschedule, please let me know as soon as possible.

Looking forward to connecting with you!

Best,
[Your Name]`
                                                },
                                                {
                                                    id: "checkin",
                                                    title: "💬 Weekly Check-in",
                                                    desc: "Keep clients engaged",
                                                    fullText: `Subject: How's Your Week Going? 💪

Hi [Client Name],

I wanted to check in and see how you're doing with your protocol this week!

A few quick questions:
1. How are your energy levels (1-10)?
2. Any challenges with the nutrition plan?
3. How's your sleep been?

Remember, there's no judgment here – I'm here to help you troubleshoot and stay on track.

Reply when you get a chance, or we can discuss at our next session.

Cheering you on,
[Your Name]`
                                                },
                                                {
                                                    id: "missed",
                                                    title: "😔 Missed Session",
                                                    desc: "Reconnect after no-show",
                                                    fullText: `Subject: I Missed You Today – Everything OK?

Hi [Client Name],

I noticed we missed our session today and wanted to check in to make sure everything is okay.

Life happens, and I completely understand! When you're ready, let's reschedule so we can keep your momentum going.

Here are some available times:
• [Option 1]
• [Option 2]
• [Option 3]

Please let me know what works best for you, or if there's anything I can help with.

Thinking of you,
[Your Name]`
                                                },
                                                {
                                                    id: "complete",
                                                    title: "🎊 Protocol Complete",
                                                    desc: "Celebrate completion",
                                                    fullText: `Subject: 🎉 Congratulations – You Did It!

Hi [Client Name],

WOW! You've officially completed your [Protocol Name] program!

I am SO proud of everything you've accomplished:
• [Specific achievement 1]
• [Specific achievement 2]
• [Specific achievement 3]

This is a huge milestone, and you should be incredibly proud of yourself.

What's next? I'd love to discuss how we can continue supporting your health journey. We have a few options:
• Maintenance coaching (monthly check-ins)
• Advanced protocol for continued progress
• Group coaching community

Let me know if you'd like to explore any of these!

Celebrating you,
[Your Name]`
                                                },
                                                {
                                                    id: "renew",
                                                    title: "🔄 Renewal Prompt",
                                                    desc: "Extend coaching",
                                                    fullText: `Subject: Let's Keep Your Momentum Going! 🚀

Hi [Client Name],

I can't believe how far you've come in our time together! Your program is coming to an end, and I wanted to reach out about what's next.

Many clients find that continuing with monthly support helps them:
• Maintain their results long-term
• Navigate new challenges as they arise
• Stay accountable and motivated

I'd love to continue supporting you! Here are our options:
• 1:1 Monthly Coaching: $[Price]/month
• Group Program: $[Price]/month
• VIP Day: $[Price] one-time

Let me know if you'd like to chat about which option fits best for your goals.

So grateful to be part of your journey,
[Your Name]`
                                                },
                                            ].map((template) => (
                                                <details key={template.id} className="group border border-gray-200 rounded-xl overflow-hidden">
                                                    <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors">
                                                        <div className="flex items-center gap-3">
                                                            <h4 className="font-semibold text-gray-900">{template.title}</h4>
                                                            <Badge variant="outline" className="text-xs">{template.desc}</Badge>
                                                        </div>
                                                        <ChevronRight className="w-4 h-4 text-gray-400 group-open:rotate-90 transition-transform" />
                                                    </summary>
                                                    <div className="p-4 bg-gray-50 border-t border-gray-200">
                                                        <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans mb-4 bg-white p-4 rounded-lg border border-gray-100">{template.fullText}</pre>
                                                        <Button
                                                            size="sm"
                                                            className="bg-burgundy-600 hover:bg-burgundy-700"
                                                            onClick={() => {
                                                                navigator.clipboard.writeText(template.fullText);
                                                                toast.success("Template copied to clipboard!");
                                                            }}
                                                        >
                                                            📋 Copy Full Template
                                                        </Button>
                                                    </div>
                                                </details>
                                            ))}
                                        </div>
                                    </div>
                                </TabsContent>

                                {/* Resources Tab */}
                                {/* Resources Tab - Coach's Own Resources */}
                                <TabsContent value="resources" className="mt-6">
                                    <div className="bg-white rounded-2xl border border-gray-100 p-6">
                                        <div className="flex items-center justify-between mb-6">
                                            <div>
                                                <h3 className="font-bold text-gray-900">My Resources</h3>
                                                <p className="text-sm text-gray-500">Upload and manage resources to share with clients</p>
                                            </div>
                                            <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => toast.info("Upload feature coming soon! For now, use the built-in resources below.")}>
                                                <Plus className="w-4 h-4 mr-2" /> Upload Resource
                                            </Button>
                                        </div>

                                        {/* Your Uploaded Resources */}
                                        <div className="mb-6">
                                            <h4 className="text-sm font-medium text-gray-700 mb-3">Your Uploaded Resources</h4>
                                            <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center">
                                                <FileText className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                                                <p className="text-sm text-gray-500 mb-2">No resources uploaded yet</p>
                                                <p className="text-xs text-gray-400">Upload PDFs, guides, worksheets to share with clients</p>
                                            </div>
                                        </div>

                                        {/* Built-in Resources */}
                                        <div className="mb-6">
                                            <h4 className="text-sm font-medium text-gray-700 mb-3">Built-in Resources (Free to Use)</h4>
                                            <div className="grid md:grid-cols-3 gap-4">
                                                {[
                                                    { icon: "📋", title: "Intake Questionnaire", type: "PDF", category: "Forms" },
                                                    { icon: "📊", title: "Weekly Tracking Sheet", type: "PDF", category: "Tracking" },
                                                    { icon: "🎯", title: "Goal Setting Worksheet", type: "PDF", category: "Coaching" },
                                                ].map((resource, i) => (
                                                    <div key={i} className="p-4 border border-gray-100 rounded-xl hover:border-blue-200 transition-all">
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <span className="text-2xl">{resource.icon}</span>
                                                            <div>
                                                                <p className="font-medium text-sm">{resource.title}</p>
                                                                <p className="text-xs text-gray-500">{resource.type} • {resource.category}</p>
                                                            </div>
                                                        </div>
                                                        <Button size="sm" variant="outline" className="w-full mt-2" onClick={() => toast.info(`"${resource.title}" ready to share! Select a client first.`)}>
                                                            Share with Client
                                                        </Button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Upsell - Premium Resources */}
                                        <div className="bg-gradient-to-r from-burgundy-50 to-gold-50 rounded-xl p-5 border border-burgundy-100">
                                            <div className="flex items-start gap-4">
                                                <div className="w-12 h-12 bg-burgundy-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                                    <Heart className="w-6 h-6 text-burgundy-600" />
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-bold text-burgundy-900 mb-1">Need Professional Resources?</h4>
                                                    <p className="text-sm text-burgundy-700 mb-3">
                                                        Get 50+ done-for-you guides, meal plans, client handouts, and more - professionally designed and ready to brand!
                                                    </p>
                                                    <a href="/programs" className="inline-flex items-center gap-2 px-4 py-2 bg-burgundy-600 text-white rounded-lg hover:bg-burgundy-700 text-sm font-medium transition-colors">
                                                        Browse Program Library →
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </TabsContent>

                                {/* Programs Tab - Locked Programs to Buy */}
                                <TabsContent value="programs" className="mt-6">
                                    <div className="bg-white rounded-2xl border border-gray-100 p-6">
                                        <div className="flex items-center justify-between mb-6">
                                            <div>
                                                <h3 className="font-bold text-gray-900">Done-For-You Client Programs</h3>
                                                <p className="text-sm text-gray-500">Professional protocols ready to use with your clients</p>
                                            </div>
                                            <a href="/programs">
                                                <Button className="bg-burgundy-600 hover:bg-burgundy-700">
                                                    <ExternalLink className="w-4 h-4 mr-2" /> View Full Library
                                                </Button>
                                            </a>
                                        </div>

                                        {/* Featured Programs Grid */}
                                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                                            {[
                                                { name: "21-Day Gut Reset Protocol", price: "$197", category: "Gut Health", icon: "🌿", popular: true },
                                                { name: "Hormone Balance Blueprint", price: "$247", category: "Hormone Health", icon: "⚖️", popular: false },
                                                { name: "Detox & Cleanse Program", price: "$147", category: "Detox", icon: "✨", popular: false },
                                                { name: "Stress & Adrenal Recovery", price: "$197", category: "Stress", icon: "🧘", popular: true },
                                                { name: "Weight Loss Transformation", price: "$297", category: "Weight Loss", icon: "🎯", popular: false },
                                                { name: "Sleep Optimization System", price: "$147", category: "Sleep", icon: "😴", popular: false },
                                            ].map((program, i) => (
                                                <div key={i} className="relative p-5 border border-gray-200 rounded-xl hover:border-burgundy-200 hover:shadow-md transition-all bg-gradient-to-br from-white to-gray-50">
                                                    {program.popular && (
                                                        <Badge className="absolute top-3 right-3 bg-gold-500 text-white border-0 text-xs">Popular</Badge>
                                                    )}
                                                    <div className="flex items-center gap-3 mb-3">
                                                        <span className="text-3xl">{program.icon}</span>
                                                        <div>
                                                            <p className="font-semibold text-gray-900">{program.name}</p>
                                                            <p className="text-xs text-gray-500">{program.category}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center justify-between mt-4">
                                                        <span className="text-lg font-bold text-burgundy-600">{program.price}</span>
                                                        <a href="/programs">
                                                            <Button size="sm" variant="outline" className="text-burgundy-600 border-burgundy-200 hover:bg-burgundy-50">
                                                                View Details
                                                            </Button>
                                                        </a>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* CTA Banner */}
                                        <div className="bg-gradient-to-r from-burgundy-600 to-burgundy-700 rounded-xl p-6 text-white">
                                            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                                                <div>
                                                    <h4 className="font-bold text-lg mb-1">Unlock All 50+ Programs</h4>
                                                    <p className="text-burgundy-200 text-sm">Get instant access to our complete library of done-for-you client programs</p>
                                                </div>
                                                <a href="/programs">
                                                    <Button className="bg-white text-burgundy-700 hover:bg-gold-50 font-semibold">
                                                        Browse All Programs →
                                                    </Button>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </TabsContent>

                                {/* Groups Tab */}
                                <TabsContent value="groups" className="mt-6">
                                    <div className="bg-white rounded-2xl border border-gray-100 p-6">
                                        <div className="flex items-center justify-between mb-6">
                                            <div>
                                                <h3 className="font-bold text-gray-900">Group Coaching</h3>
                                                <p className="text-sm text-gray-500">Manage group programs and cohorts</p>
                                            </div>
                                            <Button onClick={() => toast.info("Group creation coming soon! This feature is in development.")} className="bg-burgundy-600 hover:bg-burgundy-700">
                                                <Plus className="w-4 h-4 mr-2" /> Create Group
                                            </Button>
                                        </div>

                                        {/* Empty State */}
                                        <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center">
                                            <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                            <h4 className="font-medium text-gray-900 mb-1">No groups yet</h4>
                                            <p className="text-sm text-gray-500 mb-4">Create a group program to coach multiple clients together</p>
                                            <Button variant="outline" onClick={() => toast.info("Group creation coming soon! This feature is in development.")}><Plus className="w-4 h-4 mr-2" /> Create Your First Group</Button>
                                        </div>

                                        {/* Group Benefits */}
                                        <div className="mt-6 grid md:grid-cols-3 gap-4">
                                            {[
                                                { icon: "👥", title: "Group Calls", desc: "Schedule live sessions with all members" },
                                                { icon: "📚", title: "Shared Resources", desc: "Share materials with entire group" },
                                                { icon: "💬", title: "Community", desc: "Members can support each other" },
                                            ].map((benefit, i) => (
                                                <div key={i} className="p-4 bg-burgundy-50 rounded-xl">
                                                    <span className="text-2xl mb-2 block">{benefit.icon}</span>
                                                    <p className="font-medium text-burgundy-900">{benefit.title}</p>
                                                    <p className="text-xs text-burgundy-700">{benefit.desc}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </TabsContent>

                                {/* Billing Tab */}
                                <TabsContent value="billing" className="mt-6">
                                    <div className="bg-white rounded-2xl border border-gray-100 p-6">
                                        <div className="text-center py-12">
                                            <div className="w-20 h-20 bg-burgundy-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                                <TrendingUp className="w-10 h-10 text-burgundy-600" />
                                            </div>
                                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Billing & Payments</h3>
                                            <p className="text-gray-500 mb-6 max-w-md mx-auto">
                                                Track client payments, manage invoices, and connect your payment processor.
                                            </p>
                                            <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 max-w-lg mx-auto">
                                                <p className="text-sm text-amber-800">
                                                    <strong>💳 Stripe Integration Coming Soon</strong><br />
                                                    <span className="text-xs">Connect your Stripe account to automatically collect payments and track your business.</span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </TabsContent>

                                {/* Session Notes Library Tab */}
                                <TabsContent value="notes-library" className="mt-6">
                                    <div className="bg-white rounded-2xl border border-gray-100 p-6">
                                        <div className="flex items-center justify-between mb-6">
                                            <div>
                                                <h3 className="font-bold text-gray-900 text-xl">Session Notes Library</h3>
                                                <p className="text-sm text-gray-500">Reusable session notes and templates</p>
                                            </div>
                                            <Button onClick={() => toast.info("Note template creation coming soon!")} className="bg-burgundy-600 hover:bg-burgundy-700">
                                                <Plus className="w-4 h-4 mr-2" /> Add Note Template
                                            </Button>
                                        </div>

                                        {/* Search */}
                                        <div className="relative mb-6">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <Input placeholder="Search notes..." className="pl-10" />
                                        </div>

                                        {/* Note Categories */}
                                        <div className="flex flex-wrap gap-2 mb-6">
                                            {["All", "Initial Consultation", "Follow-up", "Progress Review", "Check-in", "Discharge"].map((cat, i) => (
                                                <Button
                                                    key={cat}
                                                    variant={i === 0 ? "default" : "outline"}
                                                    size="sm"
                                                    className={i === 0 ? "bg-burgundy-600" : ""}
                                                    onClick={() => toast.info(`Filtering by: ${cat}`)}
                                                >
                                                    {cat}
                                                </Button>
                                            ))}
                                        </div>

                                        {/* Notes Grid */}
                                        <div className="grid md:grid-cols-2 gap-4">
                                            {[
                                                { title: "Initial Intake Template", category: "Initial Consultation", lastUsed: "2 days ago", preview: "Chief complaints, health history, goals..." },
                                                { title: "Weekly Check-in", category: "Check-in", lastUsed: "Yesterday", preview: "Progress since last session, challenges faced..." },
                                                { title: "Protocol Review", category: "Follow-up", lastUsed: "1 week ago", preview: "Protocol adherence, symptom changes..." },
                                                { title: "Progress Assessment", category: "Progress Review", lastUsed: "3 days ago", preview: "Metrics review, goal progress, adjustments..." },
                                                { title: "Discharge Summary", category: "Discharge", lastUsed: "2 weeks ago", preview: "Journey summary, recommendations, next steps..." },
                                                { title: "Quick Session Notes", category: "Check-in", lastUsed: "Today", preview: "Brief session summary, action items..." },
                                            ].map((note, i) => (
                                                <div key={i} className="border border-gray-200 rounded-xl p-4 hover:border-burgundy-200 hover:bg-burgundy-50/30 transition-colors cursor-pointer">
                                                    <div className="flex items-start justify-between mb-2">
                                                        <h4 className="font-semibold text-gray-900">{note.title}</h4>
                                                        <Badge variant="outline" className="text-xs">{note.category}</Badge>
                                                    </div>
                                                    <p className="text-sm text-gray-500 mb-3 line-clamp-2">{note.preview}</p>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xs text-gray-400">Last used: {note.lastUsed}</span>
                                                        <div className="flex gap-2">
                                                            <Button variant="ghost" size="sm" className="h-7" onClick={() => toast.success(`Viewing: ${note.title}`)}>
                                                                <Eye className="w-3 h-3 mr-1" /> View
                                                            </Button>
                                                            <Button variant="ghost" size="sm" className="h-7" onClick={() => toast.success(`Using template: ${note.title}`)}>
                                                                <Edit className="w-3 h-3 mr-1" /> Use
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </TabsContent>

                                {/* Availability Tab */}
                                <TabsContent value="availability" className="mt-6">
                                    <div className="bg-white rounded-2xl border border-gray-100 p-6">
                                        <div className="flex items-center justify-between mb-6">
                                            <div>
                                                <h3 className="font-bold text-gray-900 text-xl">Availability Settings</h3>
                                                <p className="text-sm text-gray-500">Set your coaching availability hours</p>
                                            </div>
                                            <Button onClick={() => toast.success("Availability settings saved!")} className="bg-burgundy-600 hover:bg-burgundy-700">
                                                <Save className="w-4 h-4 mr-2" /> Save Changes
                                            </Button>
                                        </div>

                                        {/* Time Zone */}
                                        <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                                            <label className="text-sm font-medium text-gray-700 mb-2 block">Your Time Zone</label>
                                            <select className="w-full md:w-auto px-4 py-2 border border-gray-200 rounded-lg">
                                                <option>America/New_York (EST)</option>
                                                <option>America/Chicago (CST)</option>
                                                <option>America/Denver (MST)</option>
                                                <option>America/Los_Angeles (PST)</option>
                                                <option>Europe/London (GMT)</option>
                                                <option>Europe/Paris (CET)</option>
                                            </select>
                                        </div>

                                        {/* Weekly Schedule */}
                                        <h4 className="font-semibold text-gray-900 mb-4">Weekly Availability</h4>
                                        <div className="space-y-3">
                                            {[
                                                { day: "Monday", enabled: true, start: "09:00", end: "17:00" },
                                                { day: "Tuesday", enabled: true, start: "09:00", end: "17:00" },
                                                { day: "Wednesday", enabled: true, start: "10:00", end: "18:00" },
                                                { day: "Thursday", enabled: true, start: "09:00", end: "17:00" },
                                                { day: "Friday", enabled: true, start: "09:00", end: "15:00" },
                                                { day: "Saturday", enabled: false, start: "", end: "" },
                                                { day: "Sunday", enabled: false, start: "", end: "" },
                                            ].map((schedule) => (
                                                <div key={schedule.day} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                                                    <input
                                                        type="checkbox"
                                                        defaultChecked={schedule.enabled}
                                                        className="w-5 h-5 rounded border-gray-300 text-burgundy-600"
                                                    />
                                                    <span className="w-28 font-medium text-gray-700">{schedule.day}</span>
                                                    {schedule.enabled ? (
                                                        <div className="flex items-center gap-2">
                                                            <Input type="time" defaultValue={schedule.start} className="w-32" />
                                                            <span className="text-gray-400">to</span>
                                                            <Input type="time" defaultValue={schedule.end} className="w-32" />
                                                        </div>
                                                    ) : (
                                                        <span className="text-gray-400 italic">Unavailable</span>
                                                    )}
                                                </div>
                                            ))}
                                        </div>

                                        {/* Session Settings */}
                                        <h4 className="font-semibold text-gray-900 mb-4 mt-8">Session Settings</h4>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div className="p-4 bg-gray-50 rounded-xl">
                                                <label className="text-sm font-medium text-gray-700 mb-2 block">Default Session Duration</label>
                                                <select className="w-full px-4 py-2 border border-gray-200 rounded-lg">
                                                    <option>30 minutes</option>
                                                    <option>45 minutes</option>
                                                    <option selected>60 minutes</option>
                                                    <option>90 minutes</option>
                                                </select>
                                            </div>
                                            <div className="p-4 bg-gray-50 rounded-xl">
                                                <label className="text-sm font-medium text-gray-700 mb-2 block">Buffer Between Sessions</label>
                                                <select className="w-full px-4 py-2 border border-gray-200 rounded-lg">
                                                    <option>No buffer</option>
                                                    <option selected>15 minutes</option>
                                                    <option>30 minutes</option>
                                                    <option>60 minutes</option>
                                                </select>
                                            </div>
                                            <div className="p-4 bg-gray-50 rounded-xl">
                                                <label className="text-sm font-medium text-gray-700 mb-2 block">Booking Notice</label>
                                                <select className="w-full px-4 py-2 border border-gray-200 rounded-lg">
                                                    <option>Same day</option>
                                                    <option selected>24 hours</option>
                                                    <option>48 hours</option>
                                                    <option>1 week</option>
                                                </select>
                                            </div>
                                            <div className="p-4 bg-gray-50 rounded-xl">
                                                <label className="text-sm font-medium text-gray-700 mb-2 block">Max Clients Per Day</label>
                                                <Input type="number" defaultValue={6} min={1} max={20} />
                                            </div>
                                        </div>

                                        {/* Calendar Integration */}
                                        <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                                            <div className="flex items-center gap-3 mb-4">
                                                <Calendar className="w-6 h-6 text-blue-600" />
                                                <h4 className="font-semibold text-blue-900">Calendar Integration</h4>
                                            </div>
                                            <p className="text-sm text-blue-700 mb-4">Connect your external calendar for two-way sync</p>
                                            <div className="flex gap-3">
                                                <Button variant="outline" className="bg-white" onClick={() => toast.info("Google Calendar integration coming soon!")}>
                                                    <img src="https://www.google.com/calendar/images/favicon.ico" alt="" className="w-4 h-4 mr-2" />
                                                    Google Calendar
                                                </Button>
                                                <Button variant="outline" className="bg-white" onClick={() => toast.info("Calendly integration coming soon!")}>
                                                    <span className="w-4 h-4 mr-2">📅</span>
                                                    Calendly
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </TabsContent>

                                {/* Analytics Tab */}
                                <TabsContent value="analytics" className="mt-6">
                                    <div className="bg-white rounded-2xl border border-gray-100 p-6">
                                        <div className="flex items-center justify-between mb-6">
                                            <div>
                                                <h3 className="font-bold text-gray-900 text-xl">Practice Analytics</h3>
                                                <p className="text-sm text-gray-500">Track your coaching practice performance</p>
                                            </div>
                                            <Badge className="bg-burgundy-100 text-burgundy-700 border-0">Last 30 Days</Badge>
                                        </div>

                                        {/* Key Metrics */}
                                        <div className="grid md:grid-cols-4 gap-4 mb-8">
                                            {[
                                                { label: "Total Sessions", value: clients.reduce((acc, c) => acc + c.sessions.length, 0), trend: "+12%", color: "blue", icon: Calendar },
                                                { label: "Active Clients", value: clients.filter(c => c.status === "ACTIVE").length, trend: "+3", color: "burgundy", icon: Users },
                                                { label: "Completion Rate", value: "78%", trend: "+5%", color: "purple", icon: Target },
                                                { label: "Avg. Session/Client", value: clients.length > 0 ? (clients.reduce((acc, c) => acc + c.sessions.length, 0) / clients.length).toFixed(1) : "0", color: "amber", icon: TrendingUp },
                                            ].map((metric) => (
                                                <div key={metric.label} className={`p-4 bg-${metric.color}-50 rounded-xl`}>
                                                    <div className="flex items-center justify-between mb-2">
                                                        <metric.icon className={`w-5 h-5 text-${metric.color}-600`} />
                                                        {metric.trend && <span className="text-xs text-burgundy-600 font-medium">{metric.trend}</span>}
                                                    </div>
                                                    <p className={`text-2xl font-bold text-${metric.color}-700`}>{metric.value}</p>
                                                    <p className="text-xs text-gray-500">{metric.label}</p>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Charts Area */}
                                        <div className="grid md:grid-cols-2 gap-6 mb-6">
                                            {/* Session Trend */}
                                            <div className="border border-gray-100 rounded-xl p-4">
                                                <h4 className="font-semibold text-gray-900 mb-4">Sessions Over Time</h4>
                                                <div className="h-40 flex items-end justify-between gap-2">
                                                    {["Week 1", "Week 2", "Week 3", "Week 4"].map((week, i) => {
                                                        const heights = [40, 60, 55, 75];
                                                        return (
                                                            <div key={week} className="flex-1 flex flex-col items-center">
                                                                <div
                                                                    className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg transition-all"
                                                                    style={{ height: `${heights[i]}%` }}
                                                                />
                                                                <p className="text-xs text-gray-500 mt-2">{week}</p>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>

                                            {/* Client Status */}
                                            <div className="border border-gray-100 rounded-xl p-4">
                                                <h4 className="font-semibold text-gray-900 mb-4">Client Distribution</h4>
                                                <div className="space-y-3">
                                                    {[
                                                        { label: "Active", count: clients.filter(c => c.status === "ACTIVE").length, color: "burgundy", pct: 60 },
                                                        { label: "Paused", count: clients.filter(c => c.status === "PAUSED").length, color: "amber", pct: 25 },
                                                        { label: "Completed", count: clients.filter(c => c.status === "COMPLETED").length, color: "blue", pct: 15 },
                                                    ].map((status) => (
                                                        <div key={status.label}>
                                                            <div className="flex items-center justify-between text-sm mb-1">
                                                                <span className="text-gray-700">{status.label}</span>
                                                                <span className="font-medium">{status.count} clients</span>
                                                            </div>
                                                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                                                <div className={`h-full bg-${status.color}-500 rounded-full`} style={{ width: `${status.pct}%` }} />
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Top Performers */}
                                        <div className="border border-gray-100 rounded-xl p-4">
                                            <h4 className="font-semibold text-gray-900 mb-4">Most Engaged Clients</h4>
                                            <div className="space-y-3">
                                                {clients.slice(0, 5).map((client, i) => (
                                                    <div key={client.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${i === 0 ? "bg-amber-100 text-amber-700" : "bg-gray-200 text-gray-600"}`}>
                                                            {i + 1}
                                                        </span>
                                                        <Avatar className="h-8 w-8">
                                                            <AvatarFallback className="text-xs">{getInitials(client.name)}</AvatarFallback>
                                                        </Avatar>
                                                        <div className="flex-1">
                                                            <p className="text-sm font-medium">{client.name}</p>
                                                            <p className="text-xs text-gray-500">{client.sessions.length} sessions</p>
                                                        </div>
                                                        <Badge className={getStatusColor(client.status)}>{client.status}</Badge>
                                                    </div>
                                                ))}
                                                {clients.length === 0 && (
                                                    <p className="text-center text-gray-400 py-4">No clients yet</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </TabsContent>

                                {/* My Profile Tab */}
                                <TabsContent value="my-profile" className="mt-6">
                                    <div className="bg-white rounded-2xl border border-gray-100 p-6">
                                        <div className="flex items-center justify-between mb-6">
                                            <div>
                                                <h3 className="font-bold text-gray-900 text-xl">My Coach Profile</h3>
                                                <p className="text-sm text-gray-500">Build your professional coaching identity</p>
                                            </div>
                                            <Button
                                                className="bg-burgundy-600 hover:bg-burgundy-700"
                                                onClick={async () => {
                                                    setProfileSaving(true);
                                                    try {
                                                        const res = await fetch("/api/coach/profile", {
                                                            method: "PUT",
                                                            headers: { "Content-Type": "application/json" },
                                                            body: JSON.stringify({
                                                                bio: coachProfile.longBio,
                                                                professionalTitle: coachProfile.nicheStatement,
                                                                specialties: coachProfile.specializations,
                                                                website: coachProfile.websiteUrl,
                                                                socialLinks: {
                                                                    instagram: coachProfile.instagramUrl,
                                                                    facebook: coachProfile.facebookUrl,
                                                                    bookingLink: coachProfile.bookingLink,
                                                                    packages: coachProfile.packages,
                                                                    testimonials: coachProfile.testimonials,
                                                                    services: coachProfile.services,
                                                                    shortBio: coachProfile.shortBio,
                                                                },
                                                                image: coachProfile.photoUrl || undefined,
                                                            }),
                                                        });
                                                        const data = await res.json();
                                                        if (data.success) {
                                                            toast.success("Profile saved successfully!");
                                                        } else {
                                                            toast.error(data.error || "Failed to save profile");
                                                        }
                                                    } catch (error) {
                                                        console.error("Save profile error:", error);
                                                        toast.error("Failed to save profile");
                                                    } finally {
                                                        setProfileSaving(false);
                                                    }
                                                }}
                                            >
                                                {profileSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                                                Save Profile
                                            </Button>
                                        </div>

                                        {/* Profile Completion */}
                                        <div className="mb-8 p-4 bg-gradient-to-r from-burgundy-50 to-pink-50 rounded-xl border border-burgundy-100">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-sm font-medium text-burgundy-800">Profile Completion</span>
                                                <span className="text-sm font-bold text-burgundy-700">40%</span>
                                            </div>
                                            <Progress value={40} className="h-2" />
                                            <p className="text-xs text-burgundy-600 mt-2">Complete your profile to attract more clients!</p>
                                        </div>

                                        <div className="grid lg:grid-cols-3 gap-8">
                                            {/* Left Column - Photo & Status */}
                                            <div className="space-y-6">
                                                {/* Profile Photo */}
                                                <div className="text-center">
                                                    <div className="w-32 h-32 mx-auto bg-gray-100 rounded-full flex items-center justify-center relative group cursor-pointer border-4 border-white shadow-lg">
                                                        {coachProfile.photoUrl ? (
                                                            <img src={coachProfile.photoUrl} alt="Profile" className="w-full h-full rounded-full object-cover" />
                                                        ) : (
                                                            <UserCircle className="w-16 h-16 text-gray-400" />
                                                        )}
                                                        <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                            <Camera className="w-6 h-6 text-white" />
                                                        </div>
                                                    </div>
                                                    <input
                                                        type="file"
                                                        id="profile-photo-upload"
                                                        accept="image/*"
                                                        className="hidden"
                                                        onChange={(e) => {
                                                            const file = e.target.files?.[0];
                                                            if (file) {
                                                                const reader = new FileReader();
                                                                reader.onloadend = () => {
                                                                    setCoachProfile({ ...coachProfile, photoUrl: reader.result as string });
                                                                };
                                                                reader.readAsDataURL(file);
                                                            }
                                                        }}
                                                    />
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="mt-3"
                                                        onClick={() => document.getElementById('profile-photo-upload')?.click()}
                                                    >
                                                        <Camera className="w-4 h-4 mr-2" /> Upload Photo
                                                    </Button>
                                                </div>

                                                {/* Coach Status */}
                                                <div className="bg-gradient-to-br from-burgundy-50 to-burgundy-100/50 rounded-xl p-4 text-center border border-burgundy-100">
                                                    <Badge className="bg-burgundy-600 text-white border-0 text-sm px-3 py-1">✓ Certified Coach</Badge>
                                                    <p className="text-xs text-burgundy-700 mt-2">Status auto-updated from certifications</p>
                                                </div>

                                                {/* Coach Level */}
                                                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-4 border border-purple-100">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                                                            <Star className="w-5 h-5 text-purple-600" />
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-purple-900">Practitioner</p>
                                                            <p className="text-xs text-purple-600">Level 2</p>
                                                        </div>
                                                    </div>
                                                    <Progress value={65} className="h-1.5" />
                                                    <p className="text-xs text-purple-600 mt-2">350 XP to next level</p>
                                                </div>
                                            </div>

                                            {/* Middle Column - Bio & Niche */}
                                            <div className="lg:col-span-2 space-y-6">
                                                {/* Short Bio */}
                                                <div>
                                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                                        <Sparkles className="w-4 h-4 text-yellow-500" />
                                                        Headline / Short Bio
                                                    </label>
                                                    <Input
                                                        placeholder="e.g., Certified Health Coach specializing in gut health and hormones"
                                                        value={coachProfile.shortBio}
                                                        onChange={(e) => setCoachProfile({ ...coachProfile, shortBio: e.target.value })}
                                                        maxLength={150}
                                                    />
                                                    <p className="text-xs text-gray-400 mt-1">{coachProfile.shortBio.length}/150 characters</p>
                                                </div>

                                                {/* Long Bio */}
                                                <div>
                                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                                        <Edit className="w-4 h-4 text-blue-500" />
                                                        About You
                                                    </label>
                                                    <Textarea
                                                        placeholder="Tell your story... Why did you become a coach? What's your mission? What transformation do you help clients achieve?"
                                                        value={coachProfile.longBio}
                                                        onChange={(e) => setCoachProfile({ ...coachProfile, longBio: e.target.value })}
                                                        rows={4}
                                                    />
                                                </div>

                                                {/* Niche Statement */}
                                                <div>
                                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                                        <Target className="w-4 h-4 text-red-500" />
                                                        Niche Statement
                                                    </label>
                                                    <Textarea
                                                        placeholder="Who do you help and what problem do you solve? e.g., 'I help women over 40 struggling with fatigue and gut issues reclaim their energy using root-cause solutions.'"
                                                        value={coachProfile.nicheStatement}
                                                        onChange={(e) => setCoachProfile({ ...coachProfile, nicheStatement: e.target.value })}
                                                        rows={2}
                                                    />
                                                </div>

                                                {/* Specializations */}
                                                <div>
                                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                                        <Award className="w-4 h-4 text-purple-500" />
                                                        Specializations (Select up to 5)
                                                    </label>
                                                    <div className="flex flex-wrap gap-2">
                                                        {SPECIALIZATIONS.map((spec) => (
                                                            <button
                                                                key={spec}
                                                                onClick={() => {
                                                                    const current = coachProfile.specializations;
                                                                    if (current.includes(spec)) {
                                                                        setCoachProfile({ ...coachProfile, specializations: current.filter(s => s !== spec) });
                                                                    } else if (current.length < 5) {
                                                                        setCoachProfile({ ...coachProfile, specializations: [...current, spec] });
                                                                    }
                                                                }}
                                                                className={cn(
                                                                    "px-3 py-1.5 rounded-full text-xs font-medium transition-all",
                                                                    coachProfile.specializations.includes(spec)
                                                                        ? "bg-burgundy-600 text-white"
                                                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                                                )}
                                                            >
                                                                {spec}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Divider */}
                                        <hr className="my-8 border-gray-100" />

                                        {/* Certifications - Auto Populated */}
                                        <div className="mb-8">
                                            <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                                <Award className="w-5 h-5 text-burgundy-600" />
                                                Your Certifications
                                            </h4>
                                            <div className="grid md:grid-cols-3 gap-4">
                                                {[
                                                    { name: "Certified Health Coach", issuer: "AccrediPro Academy", date: "Nov 2024", status: "Active" },
                                                    { name: "Gut Health Specialist", issuer: "AccrediPro Academy", date: "Dec 2024", status: "Active" },
                                                ].map((cert, i) => (
                                                    <div key={i} className="bg-gradient-to-br from-burgundy-50 to-burgundy-100/50 rounded-xl p-4 border border-burgundy-100">
                                                        <div className="flex items-start gap-3">
                                                            <div className="w-10 h-10 bg-burgundy-100 rounded-lg flex items-center justify-center">
                                                                <Award className="w-5 h-5 text-burgundy-600" />
                                                            </div>
                                                            <div>
                                                                <p className="font-semibold text-gray-900 text-sm">{cert.name}</p>
                                                                <p className="text-xs text-gray-500">{cert.issuer}</p>
                                                                <p className="text-xs text-burgundy-600 mt-1">{cert.date} • {cert.status}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                                <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 flex items-center justify-center">
                                                    <a href="/catalog" className="text-center">
                                                        <Plus className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                                                        <p className="text-sm text-gray-500">Get More Certifications</p>
                                                    </a>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Services Offered */}
                                        <div className="mb-8">
                                            <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                                <Briefcase className="w-5 h-5 text-blue-600" />
                                                Services You Offer
                                            </h4>
                                            <div className="flex flex-wrap gap-3">
                                                {SERVICES.map((service) => (
                                                    <label key={service} className="flex items-center gap-2 cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={coachProfile.services.includes(service)}
                                                            onChange={(e) => {
                                                                if (e.target.checked) {
                                                                    setCoachProfile({ ...coachProfile, services: [...coachProfile.services, service] });
                                                                } else {
                                                                    setCoachProfile({ ...coachProfile, services: coachProfile.services.filter(s => s !== service) });
                                                                }
                                                            }}
                                                            className="w-4 h-4 rounded border-gray-300 text-burgundy-600 focus:ring-burgundy-500"
                                                        />
                                                        <span className="text-sm text-gray-700">{service}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Booking & Social Links */}
                                        <div className="grid md:grid-cols-2 gap-6 mb-8">
                                            <div>
                                                <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                                    <Calendar className="w-5 h-5 text-purple-600" />
                                                    Booking Link
                                                </h4>
                                                <Input
                                                    placeholder="https://calendly.com/yourname"
                                                    value={coachProfile.bookingLink}
                                                    onChange={(e) => setCoachProfile({ ...coachProfile, bookingLink: e.target.value })}
                                                />
                                                <p className="text-xs text-gray-500 mt-1">Calendly, TidyCal, Acuity, or any booking link</p>
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                                    <Globe className="w-5 h-5 text-green-600" />
                                                    Website
                                                </h4>
                                                <Input
                                                    placeholder="https://yourwebsite.com"
                                                    value={coachProfile.websiteUrl}
                                                    onChange={(e) => setCoachProfile({ ...coachProfile, websiteUrl: e.target.value })}
                                                />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                                    <Instagram className="w-5 h-5 text-pink-600" />
                                                    Instagram
                                                </h4>
                                                <Input
                                                    placeholder="https://instagram.com/yourhandle"
                                                    value={coachProfile.instagramUrl}
                                                    onChange={(e) => setCoachProfile({ ...coachProfile, instagramUrl: e.target.value })}
                                                />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                                    <Users className="w-5 h-5 text-blue-600" />
                                                    Facebook
                                                </h4>
                                                <Input
                                                    placeholder="https://facebook.com/yourpage"
                                                    value={coachProfile.facebookUrl}
                                                    onChange={(e) => setCoachProfile({ ...coachProfile, facebookUrl: e.target.value })}
                                                />
                                            </div>
                                        </div>

                                        {/* Coaching Packages */}
                                        <div className="mb-8">
                                            <div className="flex items-center justify-between mb-4">
                                                <h4 className="font-bold text-gray-900 flex items-center gap-2">
                                                    <Heart className="w-5 h-5 text-red-500" />
                                                    Coaching Packages
                                                </h4>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setCoachProfile({
                                                        ...coachProfile,
                                                        packages: [...coachProfile.packages, { name: "", description: "", duration: "", price: "" }]
                                                    })}
                                                >
                                                    <Plus className="w-4 h-4 mr-2" /> Add Package
                                                </Button>
                                            </div>

                                            {coachProfile.packages.length === 0 ? (
                                                <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center">
                                                    <Heart className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                                                    <p className="text-gray-500 mb-2">No packages added yet</p>
                                                    <p className="text-xs text-gray-400">Add your coaching packages to showcase your offerings</p>
                                                </div>
                                            ) : (
                                                <div className="space-y-4">
                                                    {coachProfile.packages.map((pkg, i) => (
                                                        <div key={i} className="border border-gray-200 rounded-xl p-4">
                                                            <div className="flex items-start justify-between mb-3">
                                                                <span className="text-xs font-medium text-gray-500">Package {i + 1}</span>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => setCoachProfile({
                                                                        ...coachProfile,
                                                                        packages: coachProfile.packages.filter((_, idx) => idx !== i)
                                                                    })}
                                                                >
                                                                    <Trash2 className="w-4 h-4 text-gray-400" />
                                                                </Button>
                                                            </div>
                                                            <div className="grid md:grid-cols-4 gap-3">
                                                                <Input
                                                                    placeholder="Package Name"
                                                                    value={pkg.name}
                                                                    onChange={(e) => {
                                                                        const updated = [...coachProfile.packages];
                                                                        updated[i].name = e.target.value;
                                                                        setCoachProfile({ ...coachProfile, packages: updated });
                                                                    }}
                                                                />
                                                                <Input
                                                                    placeholder="Duration (e.g., 8 weeks)"
                                                                    value={pkg.duration}
                                                                    onChange={(e) => {
                                                                        const updated = [...coachProfile.packages];
                                                                        updated[i].duration = e.target.value;
                                                                        setCoachProfile({ ...coachProfile, packages: updated });
                                                                    }}
                                                                />
                                                                <Input
                                                                    placeholder="Price (e.g., $997)"
                                                                    value={pkg.price}
                                                                    onChange={(e) => {
                                                                        const updated = [...coachProfile.packages];
                                                                        updated[i].price = e.target.value;
                                                                        setCoachProfile({ ...coachProfile, packages: updated });
                                                                    }}
                                                                />
                                                            </div>
                                                            <Textarea
                                                                className="mt-3"
                                                                placeholder="What's included in this package?"
                                                                value={pkg.description}
                                                                onChange={(e) => {
                                                                    const updated = [...coachProfile.packages];
                                                                    updated[i].description = e.target.value;
                                                                    setCoachProfile({ ...coachProfile, packages: updated });
                                                                }}
                                                                rows={2}
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {/* Testimonials */}
                                        <div className="mb-8">
                                            <div className="flex items-center justify-between mb-4">
                                                <h4 className="font-bold text-gray-900 flex items-center gap-2">
                                                    <MessageSquare className="w-5 h-5 text-amber-500" />
                                                    Client Testimonials
                                                </h4>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setCoachProfile({
                                                        ...coachProfile,
                                                        testimonials: [...coachProfile.testimonials, { name: "", text: "" }]
                                                    })}
                                                >
                                                    <Plus className="w-4 h-4 mr-2" /> Add Testimonial
                                                </Button>
                                            </div>

                                            {coachProfile.testimonials.length === 0 ? (
                                                <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center">
                                                    <MessageSquare className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                                                    <p className="text-gray-500 mb-2">No testimonials added yet</p>
                                                    <p className="text-xs text-gray-400">Add testimonials from happy clients to build trust</p>
                                                </div>
                                            ) : (
                                                <div className="grid md:grid-cols-2 gap-4">
                                                    {coachProfile.testimonials.map((test, i) => (
                                                        <div key={i} className="border border-gray-200 rounded-xl p-4">
                                                            <div className="flex items-start justify-between mb-3">
                                                                <Input
                                                                    placeholder="Client Name"
                                                                    value={test.name}
                                                                    onChange={(e) => {
                                                                        const updated = [...coachProfile.testimonials];
                                                                        updated[i].name = e.target.value;
                                                                        setCoachProfile({ ...coachProfile, testimonials: updated });
                                                                    }}
                                                                    className="text-sm"
                                                                />
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => setCoachProfile({
                                                                        ...coachProfile,
                                                                        testimonials: coachProfile.testimonials.filter((_, idx) => idx !== i)
                                                                    })}
                                                                >
                                                                    <Trash2 className="w-4 h-4 text-gray-400" />
                                                                </Button>
                                                            </div>
                                                            <Textarea
                                                                placeholder="What did your client say about working with you?"
                                                                value={test.text}
                                                                onChange={(e) => {
                                                                    const updated = [...coachProfile.testimonials];
                                                                    updated[i].text = e.target.value;
                                                                    setCoachProfile({ ...coachProfile, testimonials: updated });
                                                                }}
                                                                rows={3}
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {/* Preview CTA */}
                                        <div className="p-6 bg-gradient-to-r from-burgundy-600 to-purple-600 rounded-xl text-white">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h4 className="font-bold text-lg mb-1">🎉 Your Coach Profile is Taking Shape!</h4>
                                                    <p className="text-white/80 text-sm">Complete all sections to unlock your public profile page</p>
                                                </div>
                                                <Button className="bg-white text-burgundy-600 hover:bg-burgundy-50" disabled>
                                                    <Eye className="w-4 h-4 mr-2" /> Preview Profile (Coming Soon)
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </div>
                    )}
            </div>
            </div>
        </>
    );
}
