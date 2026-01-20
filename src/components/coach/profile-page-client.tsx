"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
    Save,
    Loader2,
    Camera,
    Globe,
    Instagram,
    Facebook,
    Link as LinkIcon,
    Plus,
    Trash2,
    UserCircle,
    Award,
    MessageSquare,
} from "lucide-react";

interface User {
    id: string;
    firstName: string | null;
    lastName: string | null;
    email: string | null;
    image: string | null;
    bio: string | null;
    professionalTitle: string | null;
    qualifications: string[];
    specialties: string[];
    personalQuote: string | null;
    availabilityNote: string | null;
    acceptingClients: boolean;
    isPublicDirectory: boolean;
    website: string | null;
    socialLinks: any;
    slug: string | null;
}

const SPECIALIZATIONS = [
    "Functional Medicine", "Gut Health", "Hormone Health", "Women's Health",
    "Neurodiversity", "ADHD Support", "Autism Support", "Trauma-Informed",
    "Emotional Wellness", "Stress Management", "Weight Management", "Sleep Optimization",
    "Nutrition Coaching", "Holistic Health", "Chronic Pain", "Autoimmune Support",
];

export function ProfilePageClient({ user }: { user: User }) {
    const [saving, setSaving] = useState(false);
    const [profile, setProfile] = useState({
        photoUrl: user.image || "",
        shortBio: (user.socialLinks as any)?.shortBio || "",
        longBio: user.bio || "",
        nicheStatement: user.professionalTitle || "",
        specializations: user.specialties || [],
        bookingLink: (user.socialLinks as any)?.bookingLink || "",
        websiteUrl: user.website || "",
        instagramUrl: (user.socialLinks as any)?.instagram || "",
        facebookUrl: (user.socialLinks as any)?.facebook || "",
        packages: (user.socialLinks as any)?.packages || [] as { name: string; description: string; duration: string; price: string }[],
        testimonials: (user.socialLinks as any)?.testimonials || [] as { name: string; text: string }[],
        acceptingClients: user.acceptingClients,
        isPublicDirectory: user.isPublicDirectory,
    });

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch("/api/coach/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    bio: profile.longBio,
                    professionalTitle: profile.nicheStatement,
                    specialties: profile.specializations,
                    website: profile.websiteUrl,
                    acceptingClients: profile.acceptingClients,
                    isPublicDirectory: profile.isPublicDirectory,
                    socialLinks: {
                        instagram: profile.instagramUrl,
                        facebook: profile.facebookUrl,
                        bookingLink: profile.bookingLink,
                        packages: profile.packages,
                        testimonials: profile.testimonials,
                        shortBio: profile.shortBio,
                    },
                    image: profile.photoUrl || undefined,
                }),
            });
            const data = await res.json();
            if (data.success) {
                toast.success("Profile saved successfully!");
            } else {
                toast.error(data.error || "Failed to save profile");
            }
        } catch (error) {
            toast.error("Failed to save profile");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="p-6 max-w-4xl">
            {/* Page Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">My Coach Profile</h1>
                    <p className="text-gray-500">Build your professional coaching identity</p>
                </div>
                <Button onClick={handleSave} disabled={saving} className="bg-burgundy-600 hover:bg-burgundy-700">
                    {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                    Save Profile
                </Button>
            </div>

            <div className="space-y-8">
                {/* Photo & Status */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <UserCircle className="w-5 h-5 text-burgundy-500" />
                        Profile Photo & Status
                    </h3>
                    <div className="flex items-start gap-6">
                        {/* Profile Photo */}
                        <div className="text-center">
                            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center relative group cursor-pointer border-4 border-white shadow-lg">
                                {profile.photoUrl ? (
                                    <img src={profile.photoUrl} alt="Profile" className="w-full h-full rounded-full object-cover" />
                                ) : (
                                    <UserCircle className="w-12 h-12 text-gray-400" />
                                )}
                                <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <Camera className="w-5 h-5 text-white" />
                                </div>
                            </div>
                            <Input
                                type="file"
                                id="profile-photo"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        const reader = new FileReader();
                                        reader.onloadend = () => {
                                            setProfile({ ...profile, photoUrl: reader.result as string });
                                        };
                                        reader.readAsDataURL(file);
                                    }
                                }}
                            />
                            <label htmlFor="profile-photo" className="text-xs text-burgundy-600 hover:underline cursor-pointer mt-2 inline-block">
                                Change Photo
                            </label>
                        </div>

                        {/* Status Toggles */}
                        <div className="flex-1 space-y-4">
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                <div>
                                    <p className="font-medium text-gray-900">Accepting New Clients</p>
                                    <p className="text-sm text-gray-500">Show availability status on your profile</p>
                                </div>
                                <Switch
                                    checked={profile.acceptingClients}
                                    onCheckedChange={(checked) => setProfile({ ...profile, acceptingClients: checked })}
                                />
                            </div>
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                <div>
                                    <p className="font-medium text-gray-900">List in Public Directory</p>
                                    <p className="text-sm text-gray-500">Allow potential clients to find you</p>
                                </div>
                                <Switch
                                    checked={profile.isPublicDirectory}
                                    onCheckedChange={(checked) => setProfile({ ...profile, isPublicDirectory: checked })}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Professional Identity */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Award className="w-5 h-5 text-burgundy-500" />
                        Professional Identity
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <Label>Professional Title / Niche Statement</Label>
                            <Input
                                value={profile.nicheStatement}
                                onChange={(e) => setProfile({ ...profile, nicheStatement: e.target.value })}
                                placeholder="e.g., Certified Functional Medicine Health Coach"
                            />
                        </div>
                        <div>
                            <Label>Short Bio (for cards & previews)</Label>
                            <Textarea
                                value={profile.shortBio}
                                onChange={(e) => setProfile({ ...profile, shortBio: e.target.value })}
                                placeholder="A brief 2-3 sentence intro..."
                                rows={2}
                            />
                        </div>
                        <div>
                            <Label>Full Bio</Label>
                            <Textarea
                                value={profile.longBio}
                                onChange={(e) => setProfile({ ...profile, longBio: e.target.value })}
                                placeholder="Share your story, credentials, and approach..."
                                rows={5}
                            />
                        </div>
                    </div>
                </div>

                {/* Specializations */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                    <h3 className="font-bold text-gray-900 mb-4">Specializations</h3>
                    <p className="text-sm text-gray-500 mb-4">Select areas you specialize in</p>
                    <div className="flex flex-wrap gap-2">
                        {SPECIALIZATIONS.map((spec) => (
                            <button
                                key={spec}
                                onClick={() => {
                                    if (profile.specializations.includes(spec)) {
                                        setProfile({ ...profile, specializations: profile.specializations.filter(s => s !== spec) });
                                    } else {
                                        setProfile({ ...profile, specializations: [...profile.specializations, spec] });
                                    }
                                }}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                                    profile.specializations.includes(spec)
                                        ? "bg-burgundy-600 text-white"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                            >
                                {spec}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Links */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <LinkIcon className="w-5 h-5 text-burgundy-500" />
                        Links & Social
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <Label className="flex items-center gap-2"><Globe className="w-4 h-4" />Website</Label>
                            <Input
                                value={profile.websiteUrl}
                                onChange={(e) => setProfile({ ...profile, websiteUrl: e.target.value })}
                                placeholder="https://yourwebsite.com"
                            />
                        </div>
                        <div>
                            <Label className="flex items-center gap-2"><LinkIcon className="w-4 h-4" />Booking Link</Label>
                            <Input
                                value={profile.bookingLink}
                                onChange={(e) => setProfile({ ...profile, bookingLink: e.target.value })}
                                placeholder="https://calendly.com/yourname"
                            />
                        </div>
                        <div>
                            <Label className="flex items-center gap-2"><Instagram className="w-4 h-4" />Instagram</Label>
                            <Input
                                value={profile.instagramUrl}
                                onChange={(e) => setProfile({ ...profile, instagramUrl: e.target.value })}
                                placeholder="@yourhandle"
                            />
                        </div>
                        <div>
                            <Label className="flex items-center gap-2"><Facebook className="w-4 h-4" />Facebook</Label>
                            <Input
                                value={profile.facebookUrl}
                                onChange={(e) => setProfile({ ...profile, facebookUrl: e.target.value })}
                                placeholder="facebook.com/yourpage"
                            />
                        </div>
                    </div>
                </div>

                {/* Packages */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-gray-900">Coaching Packages</h3>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setProfile({
                                ...profile,
                                packages: [...profile.packages, { name: "", description: "", duration: "", price: "" }]
                            })}
                        >
                            <Plus className="w-4 h-4 mr-2" /> Add Package
                        </Button>
                    </div>
                    {profile.packages.length === 0 ? (
                        <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-xl">
                            <p className="text-gray-500 mb-2">No packages added yet</p>
                            <p className="text-xs text-gray-400">Add your coaching packages to showcase your offerings</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {profile.packages.map((pkg, i) => (
                                <div key={i} className="border border-gray-200 rounded-xl p-4">
                                    <div className="flex items-start justify-between mb-3">
                                        <span className="text-xs font-medium text-gray-500">Package {i + 1}</span>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setProfile({
                                                ...profile,
                                                packages: profile.packages.filter((_, idx) => idx !== i)
                                            })}
                                        >
                                            <Trash2 className="w-4 h-4 text-gray-400" />
                                        </Button>
                                    </div>
                                    <div className="grid md:grid-cols-3 gap-3">
                                        <Input
                                            placeholder="Package Name"
                                            value={pkg.name}
                                            onChange={(e) => {
                                                const updated = [...profile.packages];
                                                updated[i].name = e.target.value;
                                                setProfile({ ...profile, packages: updated });
                                            }}
                                        />
                                        <Input
                                            placeholder="Duration (e.g., 8 weeks)"
                                            value={pkg.duration}
                                            onChange={(e) => {
                                                const updated = [...profile.packages];
                                                updated[i].duration = e.target.value;
                                                setProfile({ ...profile, packages: updated });
                                            }}
                                        />
                                        <Input
                                            placeholder="Price (e.g., $997)"
                                            value={pkg.price}
                                            onChange={(e) => {
                                                const updated = [...profile.packages];
                                                updated[i].price = e.target.value;
                                                setProfile({ ...profile, packages: updated });
                                            }}
                                        />
                                    </div>
                                    <Textarea
                                        className="mt-3"
                                        placeholder="What's included?"
                                        value={pkg.description}
                                        onChange={(e) => {
                                            const updated = [...profile.packages];
                                            updated[i].description = e.target.value;
                                            setProfile({ ...profile, packages: updated });
                                        }}
                                        rows={2}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Testimonials */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-gray-900 flex items-center gap-2">
                            <MessageSquare className="w-5 h-5 text-amber-500" />
                            Client Testimonials
                        </h3>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setProfile({
                                ...profile,
                                testimonials: [...profile.testimonials, { name: "", text: "" }]
                            })}
                        >
                            <Plus className="w-4 h-4 mr-2" /> Add Testimonial
                        </Button>
                    </div>
                    {profile.testimonials.length === 0 ? (
                        <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-xl">
                            <p className="text-gray-500 mb-2">No testimonials yet</p>
                            <p className="text-xs text-gray-400">Add client testimonials to build trust</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {profile.testimonials.map((t, i) => (
                                <div key={i} className="border border-gray-200 rounded-xl p-4">
                                    <div className="flex items-start justify-between mb-3">
                                        <Input
                                            placeholder="Client Name"
                                            value={t.name}
                                            onChange={(e) => {
                                                const updated = [...profile.testimonials];
                                                updated[i].name = e.target.value;
                                                setProfile({ ...profile, testimonials: updated });
                                            }}
                                            className="max-w-xs"
                                        />
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setProfile({
                                                ...profile,
                                                testimonials: profile.testimonials.filter((_, idx) => idx !== i)
                                            })}
                                        >
                                            <Trash2 className="w-4 h-4 text-gray-400" />
                                        </Button>
                                    </div>
                                    <Textarea
                                        placeholder="What did they say?"
                                        value={t.text}
                                        onChange={(e) => {
                                            const updated = [...profile.testimonials];
                                            updated[i].text = e.target.value;
                                            setProfile({ ...profile, testimonials: updated });
                                        }}
                                        rows={3}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
