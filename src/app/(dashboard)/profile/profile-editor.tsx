"use client";

import { useState, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Camera, Pencil, Loader2, Check, X } from "lucide-react";
import { useRouter } from "next/navigation";

interface ProfileEditorProps {
    userId: string;
    avatar: string | null;
    bio: string | null;
    initials: string;
}

export function ProfileEditor({ userId, avatar, bio, initials }: ProfileEditorProps) {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [currentAvatar, setCurrentAvatar] = useState(avatar);
    const [currentBio, setCurrentBio] = useState(bio || "");
    const [isEditingBio, setIsEditingBio] = useState(false);
    const [bioInput, setBioInput] = useState(bio || "");
    const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
    const [isSavingBio, setIsSavingBio] = useState(false);

    const handlePhotoClick = () => {
        fileInputRef.current?.click();
    };

    const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith("image/")) {
            alert("Please select an image file");
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert("Image size must be less than 5MB");
            return;
        }

        setIsUploadingPhoto(true);

        try {
            // Convert to base64
            const reader = new FileReader();
            reader.onloadend = async () => {
                const base64 = reader.result as string;

                // Upload to API
                const response = await fetch("/api/user/profile", {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ avatar: base64 }),
                });

                if (response.ok) {
                    setCurrentAvatar(base64);
                    router.refresh();
                } else {
                    alert("Failed to upload photo. Please try again.");
                }
                setIsUploadingPhoto(false);
            };
            reader.readAsDataURL(file);
        } catch (error) {
            console.error("Photo upload error:", error);
            alert("Failed to upload photo. Please try again.");
            setIsUploadingPhoto(false);
        }
    };

    const handleBioSave = async () => {
        setIsSavingBio(true);

        try {
            const response = await fetch("/api/user/profile", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ bio: bioInput }),
            });

            if (response.ok) {
                setCurrentBio(bioInput);
                setIsEditingBio(false);
                router.refresh();
            } else {
                alert("Failed to save bio. Please try again.");
            }
        } catch (error) {
            console.error("Bio save error:", error);
            alert("Failed to save bio. Please try again.");
        } finally {
            setIsSavingBio(false);
        }
    };

    const handleBioCancel = () => {
        setBioInput(currentBio);
        setIsEditingBio(false);
    };

    return (
        <>
            {/* Hidden file input */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
            />

            {/* Avatar with upload button */}
            <div className="relative group mb-4">
                <Avatar className="h-28 w-28 ring-4 ring-white/20 shadow-xl">
                    <AvatarImage src={currentAvatar || undefined} />
                    <AvatarFallback className="bg-gradient-to-br from-gold-400 to-gold-600 text-burgundy-900 text-3xl font-bold">
                        {initials}
                    </AvatarFallback>
                </Avatar>
                <button
                    onClick={handlePhotoClick}
                    disabled={isUploadingPhoto}
                    className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer disabled:cursor-wait"
                >
                    {isUploadingPhoto ? (
                        <Loader2 className="w-6 h-6 text-white animate-spin" />
                    ) : (
                        <div className="text-center">
                            <Camera className="w-6 h-6 text-white mx-auto mb-1" />
                            <span className="text-xs text-white font-medium">Change</span>
                        </div>
                    )}
                </button>
            </div>

            {/* Bio section */}
            {isEditingBio ? (
                <div className="w-full max-w-xl mt-3">
                    <Textarea
                        value={bioInput}
                        onChange={(e) => setBioInput(e.target.value)}
                        placeholder="Tell us about yourself..."
                        rows={3}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50 resize-none"
                        maxLength={500}
                    />
                    <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-white/60">{bioInput.length}/500</span>
                        <div className="flex gap-2">
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={handleBioCancel}
                                className="text-white/70 hover:text-white hover:bg-white/10"
                            >
                                <X className="w-4 h-4 mr-1" />
                                Cancel
                            </Button>
                            <Button
                                size="sm"
                                onClick={handleBioSave}
                                disabled={isSavingBio}
                                className="bg-gold-400/20 text-gold-200 hover:bg-gold-400/30"
                            >
                                {isSavingBio ? (
                                    <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                                ) : (
                                    <Check className="w-4 h-4 mr-1" />
                                )}
                                Save
                            </Button>
                        </div>
                    </div>
                </div>
            ) : currentBio ? (
                <div className="mt-3 max-w-xl group relative">
                    <p className="text-burgundy-100/80">{currentBio}</p>
                    <button
                        onClick={() => setIsEditingBio(true)}
                        className="absolute -right-8 top-0 opacity-0 group-hover:opacity-100 transition-opacity text-gold-300 hover:text-gold-200"
                    >
                        <Pencil className="w-4 h-4" />
                    </button>
                </div>
            ) : (
                <button
                    onClick={() => setIsEditingBio(true)}
                    className="mt-3 text-sm text-gold-300 hover:text-gold-200 flex items-center gap-1"
                >
                    <Pencil className="w-3 h-3" />
                    Add a bio
                </button>
            )}
        </>
    );
}
