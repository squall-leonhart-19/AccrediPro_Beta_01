"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
    Settings,
    Globe,
    Mail,
    Bell,
    Shield,
    Palette,
    CreditCard,
    Users,
    ArrowLeft,
    Save,
    Check,
    X,
    Loader2,
    Lock,
    Eye,
    EyeOff,
} from "lucide-react";

type SettingsSection = "general" | "branding" | "email" | "notifications" | "security" | "payments" | "users" | "integrations" | null;

const settingsConfig = {
    general: {
        title: "General Settings",
        icon: Settings,
        color: "burgundy",
    },
    branding: {
        title: "Branding & Appearance",
        icon: Palette,
        color: "purple",
    },
    email: {
        title: "Email Configuration",
        icon: Mail,
        color: "blue",
    },
    notifications: {
        title: "Notifications",
        icon: Bell,
        color: "amber",
    },
    security: {
        title: "Security & Access",
        icon: Shield,
        color: "green",
    },
    payments: {
        title: "Payments & Billing",
        icon: CreditCard,
        color: "emerald",
    },
    users: {
        title: "User Management",
        icon: Users,
        color: "pink",
    },
    integrations: {
        title: "Integrations",
        icon: Globe,
        color: "cyan",
    },
};

export function SettingsClient() {
    const [activeSection, setActiveSection] = useState<SettingsSection>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    // Form states
    const [generalSettings, setGeneralSettings] = useState({
        platformName: "AccrediPro Academy",
        supportEmail: "support@accredipro.academy",
        contactEmail: "info@accredipro.academy",
        timezone: "America/New_York",
    });

    const [emailSettings, setEmailSettings] = useState({
        smtpHost: "",
        smtpPort: "587",
        smtpUser: "",
        smtpPassword: "",
        fromName: "AccrediPro Academy",
        fromEmail: "noreply@accredipro.academy",
    });

    const [securitySettings, setSecuritySettings] = useState({
        requireEmailVerification: true,
        allowRegistration: true,
        sessionTimeout: "24",
        maxLoginAttempts: "5",
    });

    const [notificationSettings, setNotificationSettings] = useState({
        emailOnNewEnrollment: true,
        emailOnCourseComplete: true,
        emailOnNewMessage: true,
        emailOnCommunityReply: false,
    });

    const [showPassword, setShowPassword] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        // Simulate save
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsSaving(false);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
    };

    const renderSectionContent = () => {
        switch (activeSection) {
            case "general":
                return (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Platform Name</label>
                            <Input
                                value={generalSettings.platformName}
                                onChange={(e) => setGeneralSettings(prev => ({ ...prev, platformName: e.target.value }))}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Support Email</label>
                            <Input
                                type="email"
                                value={generalSettings.supportEmail}
                                onChange={(e) => setGeneralSettings(prev => ({ ...prev, supportEmail: e.target.value }))}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Contact Email</label>
                            <Input
                                type="email"
                                value={generalSettings.contactEmail}
                                onChange={(e) => setGeneralSettings(prev => ({ ...prev, contactEmail: e.target.value }))}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                            <select
                                value={generalSettings.timezone}
                                onChange={(e) => setGeneralSettings(prev => ({ ...prev, timezone: e.target.value }))}
                                className="w-full rounded-md border border-gray-300 p-2"
                            >
                                <option value="America/New_York">Eastern Time (ET)</option>
                                <option value="America/Chicago">Central Time (CT)</option>
                                <option value="America/Denver">Mountain Time (MT)</option>
                                <option value="America/Los_Angeles">Pacific Time (PT)</option>
                            </select>
                        </div>
                    </div>
                );

            case "email":
                return (
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Host</label>
                                <Input
                                    value={emailSettings.smtpHost}
                                    onChange={(e) => setEmailSettings(prev => ({ ...prev, smtpHost: e.target.value }))}
                                    placeholder="smtp.example.com"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Port</label>
                                <Input
                                    value={emailSettings.smtpPort}
                                    onChange={(e) => setEmailSettings(prev => ({ ...prev, smtpPort: e.target.value }))}
                                    placeholder="587"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Username</label>
                            <Input
                                value={emailSettings.smtpUser}
                                onChange={(e) => setEmailSettings(prev => ({ ...prev, smtpUser: e.target.value }))}
                                placeholder="username"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Password</label>
                            <div className="relative">
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    value={emailSettings.smtpPassword}
                                    onChange={(e) => setEmailSettings(prev => ({ ...prev, smtpPassword: e.target.value }))}
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                        <hr className="my-4" />
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">From Name</label>
                            <Input
                                value={emailSettings.fromName}
                                onChange={(e) => setEmailSettings(prev => ({ ...prev, fromName: e.target.value }))}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">From Email</label>
                            <Input
                                type="email"
                                value={emailSettings.fromEmail}
                                onChange={(e) => setEmailSettings(prev => ({ ...prev, fromEmail: e.target.value }))}
                            />
                        </div>
                    </div>
                );

            case "security":
                return (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                            <div>
                                <h4 className="font-medium text-gray-900">Require Email Verification</h4>
                                <p className="text-sm text-gray-500">Users must verify email before accessing platform</p>
                            </div>
                            <button
                                onClick={() => setSecuritySettings(prev => ({ ...prev, requireEmailVerification: !prev.requireEmailVerification }))}
                                className={`w-12 h-6 rounded-full transition-colors ${securitySettings.requireEmailVerification ? 'bg-green-500' : 'bg-gray-300'}`}
                            >
                                <div className={`w-5 h-5 rounded-full bg-white shadow transform transition-transform ${securitySettings.requireEmailVerification ? 'translate-x-6' : 'translate-x-0.5'}`} />
                            </button>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                            <div>
                                <h4 className="font-medium text-gray-900">Allow New Registrations</h4>
                                <p className="text-sm text-gray-500">Enable public registration for new users</p>
                            </div>
                            <button
                                onClick={() => setSecuritySettings(prev => ({ ...prev, allowRegistration: !prev.allowRegistration }))}
                                className={`w-12 h-6 rounded-full transition-colors ${securitySettings.allowRegistration ? 'bg-green-500' : 'bg-gray-300'}`}
                            >
                                <div className={`w-5 h-5 rounded-full bg-white shadow transform transition-transform ${securitySettings.allowRegistration ? 'translate-x-6' : 'translate-x-0.5'}`} />
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout (hours)</label>
                                <Input
                                    type="number"
                                    value={securitySettings.sessionTimeout}
                                    onChange={(e) => setSecuritySettings(prev => ({ ...prev, sessionTimeout: e.target.value }))}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Max Login Attempts</label>
                                <Input
                                    type="number"
                                    value={securitySettings.maxLoginAttempts}
                                    onChange={(e) => setSecuritySettings(prev => ({ ...prev, maxLoginAttempts: e.target.value }))}
                                />
                            </div>
                        </div>
                    </div>
                );

            case "notifications":
                return (
                    <div className="space-y-4">
                        {[
                            { key: "emailOnNewEnrollment", label: "New Enrollment", description: "Email admin when a new user enrolls" },
                            { key: "emailOnCourseComplete", label: "Course Completion", description: "Email when user completes a course" },
                            { key: "emailOnNewMessage", label: "New Messages", description: "Email notification for new messages" },
                            { key: "emailOnCommunityReply", label: "Community Replies", description: "Email when someone replies to a post" },
                        ].map((item) => (
                            <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                <div>
                                    <h4 className="font-medium text-gray-900">{item.label}</h4>
                                    <p className="text-sm text-gray-500">{item.description}</p>
                                </div>
                                <button
                                    onClick={() => setNotificationSettings(prev => ({ ...prev, [item.key]: !prev[item.key as keyof typeof notificationSettings] }))}
                                    className={`w-12 h-6 rounded-full transition-colors ${notificationSettings[item.key as keyof typeof notificationSettings] ? 'bg-green-500' : 'bg-gray-300'}`}
                                >
                                    <div className={`w-5 h-5 rounded-full bg-white shadow transform transition-transform ${notificationSettings[item.key as keyof typeof notificationSettings] ? 'translate-x-6' : 'translate-x-0.5'}`} />
                                </button>
                            </div>
                        ))}
                    </div>
                );

            case "branding":
            case "payments":
            case "users":
            case "integrations":
                return (
                    <div className="text-center py-12">
                        <Lock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Coming Soon</h3>
                        <p className="text-gray-500 max-w-md mx-auto">
                            This settings section is under development. Full configuration options will be available in the next update.
                        </p>
                    </div>
                );

            default:
                return null;
        }
    };

    if (activeSection) {
        const config = settingsConfig[activeSection];
        const Icon = config.icon;

        return (
            <div className="space-y-6 animate-fade-in">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" onClick={() => setActiveSection(null)}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                    </Button>
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl bg-${config.color}-100`}>
                            <Icon className={`w-5 h-5 text-${config.color}-600`} />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">{config.title}</h1>
                    </div>
                </div>

                <Card className="card-premium">
                    <CardContent className="p-6">
                        {renderSectionContent()}

                        {activeSection !== "branding" && activeSection !== "payments" && activeSection !== "users" && activeSection !== "integrations" && (
                            <div className="mt-8 pt-6 border-t flex items-center justify-between">
                                <div>
                                    {showSuccess && (
                                        <span className="text-green-600 flex items-center gap-2">
                                            <Check className="w-4 h-4" />
                                            Settings saved successfully
                                        </span>
                                    )}
                                </div>
                                <Button
                                    className="bg-burgundy-600 hover:bg-burgundy-700"
                                    onClick={handleSave}
                                    disabled={isSaving}
                                >
                                    {isSaving ? (
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    ) : (
                                        <Save className="w-4 h-4 mr-2" />
                                    )}
                                    Save Changes
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Platform Settings</h1>
                <p className="text-gray-500 mt-1">Configure your platform settings and preferences</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(Object.entries(settingsConfig) as [SettingsSection, typeof settingsConfig.general][]).map(([key, config]) => {
                    const Icon = config.icon;
                    return (
                        <Card
                            key={key}
                            className="card-premium hover:shadow-md transition-shadow cursor-pointer"
                            onClick={() => setActiveSection(key)}
                        >
                            <CardContent className="p-6">
                                <div className="flex items-start gap-4">
                                    <div className={`p-3 rounded-xl bg-${config.color}-100`}>
                                        <Icon className={`w-6 h-6 text-${config.color}-600`} />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-900">{config.title}</h3>
                                        <p className="text-sm text-gray-500 mt-1">Click to configure</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
