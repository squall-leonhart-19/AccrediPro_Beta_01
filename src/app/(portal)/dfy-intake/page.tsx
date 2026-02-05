"use client";

import { useState, useEffect, useCallback, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowRight, ArrowLeft, CheckCircle, Loader2, Upload, X,
    User, Phone, Mail, Award, Camera, BookOpen, Users, Package,
    DollarSign, Star, MessageCircle, Palette, Share2, Calendar, Target
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";

// Brand colors with metallic gold
const BRAND = {
    burgundy: "#722f37",
    burgundyDark: "#4e1f24",
    burgundyLight: "#9a4a54",
    gold: "#d4af37",
    goldLight: "#f7e7a0",
    goldDark: "#b8860b",
    cream: "#fdfbf7",
    goldMetallic: "linear-gradient(135deg, #d4af37 0%, #f7e7a0 25%, #d4af37 50%, #b8860b 75%, #d4af37 100%)",
    burgundyGold: "linear-gradient(135deg, #722f37 0%, #d4af37 100%)",
};

// Form question definitions
const FORM_STEPS = [
    {
        id: "welcome",
        type: "intro",
        title: "Let's Build Your Professional Coaching Website",
        subtitle: "Hi! I'm Jessica, your Fulfillment Operations Director. I'm so excited to create something beautiful for you!",
        description: "This takes about 10-15 minutes. Just tell me about you and your coaching — no technical stuff required!",
        tip: "Don't have something for a question? Just skip to next!",
        icon: "✨",
    },
    {
        id: "contact",
        type: "multi-input",
        title: "Let's start with your contact info",
        subtitle: "This is how we'll reach you and what we'll display on your website.",
        fields: [
            { name: "firstName", label: "First name", type: "text", placeholder: "Jane", required: true },
            { name: "lastName", label: "Last name", type: "text", placeholder: "Smith", required: true },
            { name: "phone", label: "Phone number (optional — to display on website)", type: "tel", placeholder: "(201) 555-0123" },
            { name: "email", label: "Email", type: "email", placeholder: "name@example.com", required: true },
        ],
        icon: User,
    },
    {
        id: "coachingTitle",
        type: "text",
        title: "What's your coaching title?",
        subtitle: "Example: \"Certified Functional Medicine Coach\" or \"Grief Recovery Specialist\"",
        field: { name: "coachingTitle", placeholder: "Certified Functional Medicine Coach" },
        icon: Award,
    },
    {
        id: "certifications",
        type: "textarea",
        title: "What certifications do you have?",
        subtitle: "List your AccrediPro certification and any others that show you're qualified.",
        field: { name: "certifications", placeholder: "AccrediPro Functional Medicine Certification, Precision Nutrition Level 1..." },
        icon: Award,
    },
    {
        id: "photos",
        type: "file-upload",
        title: "Upload 1-2 photos of yourself to put on your future website!",
        subtitle: "Smiling and friendly works best! You can also add photos related to your coaching (working with clients, your space, etc.)",
        field: { name: "photos", maxFiles: 2, accept: "image/*" },
        icon: Camera,
    },
    {
        id: "story",
        type: "textarea",
        title: "Tell us your story — why did you become a coach in this area?",
        subtitle: "What was your personal journey? What made you passionate about helping others? Write naturally like you're talking to a friend.",
        field: { name: "story", placeholder: "I struggled with chronic fatigue for years until I discovered functional medicine...", rows: 6 },
        icon: BookOpen,
    },
    {
        id: "idealClient",
        type: "textarea",
        title: "Who do you help?",
        subtitle: "Describe your ideal client — their age, situation, and what they're struggling with.",
        field: { name: "idealClient", placeholder: "Women 40-55 dealing with hormone imbalances, weight gain, and low energy who have tried everything but nothing works...", rows: 4 },
        icon: Users,
    },
    {
        id: "programName",
        type: "text",
        title: "What's your main program or service called?",
        subtitle: "Example: \"3-Month Hormone Reset Program\" or \"Grief Recovery Coaching\"",
        field: { name: "programName", placeholder: "3-Month Hormone Reset Program" },
        icon: Package,
    },
    {
        id: "programDetails",
        type: "textarea",
        title: "What's included and how long does it last?",
        subtitle: "Just list what they get and the timeframe.",
        field: { name: "programDetails", placeholder: "12 weekly video calls, email support, custom meal plan, workbook — 3 months total", rows: 4 },
        icon: Package,
    },
    {
        id: "price",
        type: "text",
        title: "What's your price?",
        subtitle: "Just the number. Mention payment plans if you offer them.",
        field: { name: "price", placeholder: "$1,497 or 3 payments of $549" },
        icon: DollarSign,
    },
    {
        id: "successStories",
        type: "textarea",
        title: "Do you have 1-2 client success stories?",
        subtitle: "Paste any testimonials or wins you'd like to feature. (Optional)",
        field: { name: "successStories", placeholder: '"Sarah helped me lose 30 lbs and get my energy back after struggling for 10 years" — Jennifer M.', rows: 4, optional: true },
        icon: Star,
    },
    {
        id: "differentiation",
        type: "textarea",
        title: "What makes you different from other coaches?",
        subtitle: "Why should someone choose YOU? What's special about your approach?",
        field: { name: "differentiation", placeholder: "I combine functional medicine with emotional support — we don't just fix symptoms, we find the root cause together...", rows: 4 },
        icon: Star,
    },
    {
        id: "concerns",
        type: "multi-select",
        title: "What concerns do people have before working with you?",
        subtitle: "Select all that apply — we'll address these on your website.",
        field: { name: "concerns" },
        options: [
            { value: "afford", label: '"I can\'t afford it"' },
            { value: "time", label: '"I don\'t have time"' },
            { value: "tried", label: '"I\'ve tried everything already"' },
            { value: "work", label: '"Will this really work for me?"' },
            { value: "ready", label: '"I\'m not sure I\'m ready"' },
        ],
        icon: MessageCircle,
    },
    {
        id: "websiteFeel",
        type: "multi-select",
        title: "How do you want your website to feel?",
        subtitle: "Choose as many as you like.",
        field: { name: "websiteFeel" },
        options: [
            { value: "warm", label: "Warm and nurturing (supportive friend)" },
            { value: "calm", label: "Calm and peaceful (safe space)" },
            { value: "professional", label: "Professional and credible (expert authority)" },
            { value: "gentle", label: "Gentle and patient (no pressure)" },
            { value: "empowering", label: "Strong and empowering (motivational)" },
        ],
        icon: Palette,
    },
    {
        id: "colors",
        type: "text",
        title: "What are your favorite colors for your website?",
        subtitle: "Any colors you love or that represent your brand.",
        field: { name: "colors", placeholder: "Sage green, soft coral, warm beige" },
        icon: Palette,
    },
    {
        id: "socialMedia",
        type: "text",
        title: "Do you have social media for your coaching?",
        subtitle: "Instagram, Facebook, etc. (Optional)",
        field: { name: "socialMedia", placeholder: "instagram.com/yourcoaching", optional: true },
        icon: Share2,
    },
    {
        id: "howToStart",
        type: "text",
        title: "How do you want people to start working with you?",
        subtitle: "What's the first step they should take?",
        field: { name: "howToStart", placeholder: "Book a free discovery call" },
        icon: Target,
    },
    {
        id: "schedulingTool",
        type: "text",
        title: "Do you use a scheduling tool like Calendly?",
        subtitle: "Share the link if you have one. (Optional)",
        field: { name: "schedulingTool", placeholder: "calendly.com/yourname", optional: true },
        icon: Calendar,
    },
    {
        id: "websiteGoal",
        type: "textarea",
        title: "What's your main goal for this website?",
        subtitle: "What do you want it to help you achieve?",
        field: { name: "websiteGoal", placeholder: "Get more clients from Instagram, look more professional, automate bookings...", rows: 3 },
        icon: Target,
    },
    {
        id: "anythingElse",
        type: "textarea",
        title: "Anything else we should know?",
        subtitle: "Any other details, must-haves, or things you want on your website that weren't covered above?",
        field: { name: "anythingElse", placeholder: "I love the color sage green, I want it to feel like a spa...", rows: 4, optional: true },
        icon: MessageCircle,
    },
];

interface FormData {
    [key: string]: string | string[] | File[];
}

// Main form component (wrapped in Suspense)
function DFYIntakeFormContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const urlPurchaseId = searchParams.get("id");
    const testMode = searchParams.get("test") === "true";

    const [purchaseId, setPurchaseId] = useState<string | null>(urlPurchaseId);
    const [accessChecked, setAccessChecked] = useState(false);
    const [hasAccess, setHasAccess] = useState(!!urlPurchaseId || testMode);
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState<FormData>({});
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [uploadedPhotos, setUploadedPhotos] = useState<File[]>([]);
    const [photoPreviewUrls, setPhotoPreviewUrls] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Check access based on user role (for test mode) and tags
    useEffect(() => {
        // If we have a URL purchaseId, we're good
        if (urlPurchaseId) {
            // Still fetch user info to pre-fill form
            fetch("/api/user/me")
                .then(res => res.json())
                .then(data => {
                    if (data.user) {
                        setFormData(prev => ({
                            ...prev,
                            firstName: data.user.firstName || "",
                            lastName: data.user.lastName || "",
                            email: data.user.email || "",
                        }));
                    }
                })
                .catch(() => { });
            setAccessChecked(true);
            return;
        }

        // Fetch user info for access check
        fetch("/api/user/me")
            .then(res => res.json())
            .then(data => {
                if (!data.user) {
                    setAccessChecked(true);
                    return;
                }

                // Pre-fill form data
                setFormData(prev => ({
                    ...prev,
                    firstName: data.user.firstName || "",
                    lastName: data.user.lastName || "",
                    email: data.user.email || "",
                }));

                // Test mode for admins
                const isAdmin = ["ADMIN", "SUPERUSER"].includes(data.user.role || "");
                if (testMode && isAdmin) {
                    setPurchaseId("test-" + Date.now());
                    setHasAccess(true);
                    setAccessChecked(true);
                    return;
                }

                // Check for dfy_purchased tag or fetch pending purchase
                const hasDfyTag = data.user.tags?.some((t: { tag: string }) => t.tag === "dfy_purchased");
                if (hasDfyTag) {
                    // Fetch their pending DFY purchase
                    fetch("/api/dfy/my-purchase")
                        .then(res => res.json())
                        .then(purchaseData => {
                            if (purchaseData.purchaseId) {
                                setPurchaseId(purchaseData.purchaseId);
                                setHasAccess(true);
                            }
                            setAccessChecked(true);
                        })
                        .catch(() => setAccessChecked(true));
                } else {
                    setAccessChecked(true);
                }
            })
            .catch(() => setAccessChecked(true));
    }, [urlPurchaseId, testMode]);

    const currentStepData = FORM_STEPS[currentStep];
    const progress = ((currentStep) / (FORM_STEPS.length - 1)) * 100;

    // Save progress to database for abandonment tracking
    const saveProgress = useCallback(async (step: number, abandoned = false) => {
        if (!purchaseId) return;
        try {
            await fetch("/api/dfy/progress", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    purchaseId,
                    currentStep: step,
                    totalSteps: FORM_STEPS.length,
                    stepId: FORM_STEPS[step]?.id,
                    formData,
                    abandoned,
                }),
            });
        } catch (e) {
            // Silent fail for tracking
        }
    }, [purchaseId, formData]);

    // Track abandonment on page unload
    useEffect(() => {
        const handleUnload = () => {
            if (currentStep > 0 && !submitted) {
                navigator.sendBeacon("/api/dfy/progress", JSON.stringify({
                    purchaseId,
                    currentStep,
                    totalSteps: FORM_STEPS.length,
                    stepId: currentStepData?.id,
                    formData,
                    abandoned: true,
                }));
            }
        };
        window.addEventListener("beforeunload", handleUnload);
        return () => window.removeEventListener("beforeunload", handleUnload);
    }, [currentStep, purchaseId, formData, submitted, currentStepData]);

    const handleNext = () => {
        if (currentStep < FORM_STEPS.length - 1) {
            const nextStep = currentStep + 1;
            setCurrentStep(nextStep);
            saveProgress(nextStep);
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const handleInputChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleMultiSelectToggle = (name: string, value: string) => {
        setFormData(prev => {
            const current = (prev[name] as string[]) || [];
            if (current.includes(value)) {
                return { ...prev, [name]: current.filter(v => v !== value) };
            }
            return { ...prev, [name]: [...current, value] };
        });
    };

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const newPhotos = Array.from(files).slice(0, 2 - uploadedPhotos.length);
        const newPreviewUrls = newPhotos.map(file => URL.createObjectURL(file));

        setUploadedPhotos(prev => [...prev, ...newPhotos].slice(0, 2));
        setPhotoPreviewUrls(prev => [...prev, ...newPreviewUrls].slice(0, 2));
    };

    const removePhoto = (index: number) => {
        setUploadedPhotos(prev => prev.filter((_, i) => i !== index));
        setPhotoPreviewUrls(prev => {
            URL.revokeObjectURL(prev[index]);
            return prev.filter((_, i) => i !== index);
        });
    };

    const [submitError, setSubmitError] = useState<string | null>(null);

    const handleSubmit = async () => {
        if (!purchaseId) return;

        setLoading(true);
        setSubmitError(null);

        try {
            // Upload photos first if any
            let photoUrls: string[] = [];
            if (uploadedPhotos.length > 0) {
                const uploadFormData = new FormData();
                uploadedPhotos.forEach((photo, i) => {
                    uploadFormData.append(`photo${i}`, photo);
                });
                uploadFormData.append("purchaseId", purchaseId);

                const uploadRes = await fetch("/api/dfy/upload-photos", {
                    method: "POST",
                    body: uploadFormData,
                });
                if (uploadRes.ok) {
                    const uploadData = await uploadRes.json();
                    photoUrls = uploadData.urls || [];
                }
            }

            // Submit form data
            const res = await fetch("/api/dfy/intake", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    purchaseId,
                    intakeData: {
                        ...formData,
                        photoUrls,
                    },
                }),
            });

            if (res.ok) {
                setSubmitted(true);
            } else {
                const errorData = await res.json().catch(() => ({}));
                console.error("Submit failed:", res.status, errorData);
                setSubmitError(errorData.error || `Submission failed (${res.status}). Please try again.`);
            }
        } catch (error) {
            console.error("Failed to submit:", error);
            setSubmitError("Network error. Please check your connection and try again.");
        }
        setLoading(false);
    };

    // Still checking access
    if (!accessChecked && !urlPurchaseId) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-gray-400 mx-auto mb-4 animate-spin" />
                    <p className="text-gray-500">Checking access...</p>
                </div>
            </div>
        );
    }

    // No access (no purchaseId and no valid tag)
    if (!hasAccess || !purchaseId) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
                <div className="text-center">
                    <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h1 className="text-xl font-bold text-gray-800">Access Required</h1>
                    <p className="text-gray-500 mt-2">
                        {urlPurchaseId
                            ? "This intake form link is invalid or expired."
                            : "You need to purchase a DFY package to access this form."}
                    </p>
                </div>
            </div>
        );
    }

    // Success screen with auto-redirect
    if (submitted) {
        // Auto-redirect after 5 seconds
        setTimeout(() => {
            router.push("/my-courses");
        }, 5000);

        return (
            <div
                className="min-h-screen flex items-center justify-center p-4"
                style={{ background: `linear-gradient(to bottom right, ${BRAND.cream}, #f5f0e8)` }}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white rounded-2xl shadow-2xl p-8 md:p-10 max-w-lg w-full text-center"
                    style={{ boxShadow: `0 0 0 3px ${BRAND.gold}40, 0 25px 50px -12px rgba(114, 47, 55, 0.25)` }}
                >
                    <div
                        className="w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center"
                        style={{ background: `${BRAND.gold}20` }}
                    >
                        <CheckCircle className="w-12 h-12" style={{ color: BRAND.gold }} />
                    </div>
                    <h1
                        className="text-2xl md:text-3xl font-bold mb-3"
                        style={{ color: BRAND.burgundyDark }}
                    >
                        Intake Received! 🎉
                    </h1>
                    <p className="text-gray-600 text-lg mb-6">
                        Thank you! Jessica has received your intake form and will start working on your website right away.
                    </p>
                    <div
                        className="p-5 rounded-xl mb-6 border"
                        style={{ backgroundColor: `${BRAND.gold}08`, borderColor: `${BRAND.gold}40` }}
                    >
                        <p className="text-gray-700 flex items-center justify-center gap-2 font-medium">
                            <Calendar className="w-5 h-5" style={{ color: BRAND.gold }} />
                            Your website will be ready in <strong className="text-gray-900">7 days or less</strong>
                        </p>
                    </div>
                    <Button
                        onClick={() => router.push("/my-courses")}
                        size="lg"
                        className="h-12 px-8 font-bold rounded-xl shadow-lg"
                        style={{ background: BRAND.goldMetallic, color: BRAND.burgundyDark }}
                    >
                        Go to Dashboard
                        <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                    <p className="text-xs text-gray-400 mt-4">
                        Redirecting to your dashboard in a few seconds...
                    </p>
                </motion.div>
            </div>
        );
    }

    // Render step content
    const renderStepContent = () => {
        const step = currentStepData;
        const IconComponent = typeof step.icon === "string" ? null : step.icon;

        switch (step.type) {
            case "intro":
                return (
                    <div className="space-y-6">
                        {/* Premium Header Badge */}
                        <div className="text-center">
                            <span
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold text-white shadow-lg"
                                style={{ background: BRAND.goldMetallic }}
                            >
                                <span style={{ color: BRAND.burgundyDark }}>✨ Done-For-You Website Setup</span>
                            </span>
                        </div>

                        {/* Jessica Card */}
                        <div
                            className="rounded-2xl p-6 border-2"
                            style={{
                                backgroundColor: `${BRAND.gold}08`,
                                borderColor: `${BRAND.gold}40`
                            }}
                        >
                            <div className="flex items-start gap-4">
                                <Image
                                    src="/jessica-parker.webp"
                                    alt="Jessica Parker"
                                    width={72}
                                    height={72}
                                    className="rounded-full border-3 object-cover flex-shrink-0 shadow-lg"
                                    style={{ borderColor: BRAND.gold }}
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = "/coach-sarah.webp";
                                    }}
                                />
                                <div>
                                    <p
                                        className="text-xs font-bold uppercase tracking-wide mb-1"
                                        style={{ color: BRAND.burgundy }}
                                    >
                                        YOUR FULFILLMENT SPECIALIST
                                    </p>
                                    <p className="text-gray-900 text-lg font-bold">Hey! I'm Jessica 👋</p>
                                    <p className="text-gray-600 text-sm mt-1">
                                        I'll personally design and build your professional coaching website. Let me learn about your practice so I can create something you'll love!
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Main Title */}
                        <div className="text-center space-y-3">
                            <h1
                                className="text-2xl md:text-3xl font-bold"
                                style={{ color: BRAND.burgundyDark }}
                            >
                                {step.title}
                            </h1>
                            <p className="text-gray-600">
                                {(step as any).description || step.subtitle}
                            </p>
                            {(step as any).tip && (
                                <p className="text-sm text-gray-400 italic">
                                    💡 {(step as any).tip}
                                </p>
                            )}
                        </div>

                        {/* What's Included */}
                        <div className="space-y-2">
                            {[
                                "Professional landing page design",
                                "Mobile-optimized & fast loading",
                                "Booking calendar integration",
                                "Ready in 7 days or less"
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-2 text-gray-700">
                                    <CheckCircle className="w-5 h-5 flex-shrink-0" style={{ color: BRAND.gold }} />
                                    <span className="text-sm">{item}</span>
                                </div>
                            ))}
                        </div>

                        {/* Trust Signal */}
                        <div className="text-center">
                            <p className="text-xs text-gray-400">
                                🔒 Your information is secure • 100+ websites delivered
                            </p>
                        </div>
                    </div>
                );

            case "multi-input":
                return (
                    <div className="space-y-5">
                        <div className="flex items-start gap-3 mb-6">
                            {IconComponent && <IconComponent className="w-8 h-8 flex-shrink-0 mt-1" style={{ color: BRAND.burgundy }} />}
                            <div>
                                <h2 className="text-xl md:text-2xl font-bold text-gray-900">{step.title}</h2>
                                <p className="text-sm text-gray-500 mt-1">{step.subtitle}</p>
                            </div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                            {step.fields?.map((field) => (
                                <div key={field.name} className={field.type === 'email' ? 'md:col-span-2' : ''}>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        {field.label}
                                    </label>
                                    <Input
                                        type={field.type}
                                        value={(formData[field.name] as string) || ""}
                                        onChange={(e) => handleInputChange(field.name, e.target.value)}
                                        placeholder={field.placeholder}
                                        className="h-12 text-base md:text-lg border-2 focus:ring-2 transition-all"
                                        style={{ borderColor: (formData[field.name] as string) ? BRAND.gold : '#e5e7eb' }}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case "text":
                return (
                    <div>
                        <div className="flex items-start gap-3 mb-6">
                            {IconComponent && <IconComponent className="w-8 h-8 flex-shrink-0 mt-1" style={{ color: BRAND.burgundy }} />}
                            <div>
                                <h2 className="text-xl md:text-2xl font-bold text-gray-900">{step.title}</h2>
                                <p className="text-sm text-gray-500 mt-1">{step.subtitle}</p>
                            </div>
                        </div>
                        <Input
                            value={(formData[step.field!.name] as string) || ""}
                            onChange={(e) => handleInputChange(step.field!.name, e.target.value)}
                            placeholder={step.field!.placeholder}
                            className="h-12 text-base md:text-lg border-2 focus:ring-2 transition-all"
                            style={{ borderColor: (formData[step.field!.name] as string) ? BRAND.gold : '#e5e7eb' }}
                        />
                    </div>
                );

            case "textarea":
                return (
                    <div>
                        <div className="flex items-start gap-3 mb-6">
                            {IconComponent && <IconComponent className="w-8 h-8 flex-shrink-0 mt-1" style={{ color: BRAND.burgundy }} />}
                            <div>
                                <h2 className="text-xl md:text-2xl font-bold text-gray-900">{step.title}</h2>
                                <p className="text-sm text-gray-500 mt-1">{step.subtitle}</p>
                            </div>
                        </div>
                        <Textarea
                            value={(formData[step.field!.name] as string) || ""}
                            onChange={(e) => handleInputChange(step.field!.name, e.target.value)}
                            placeholder={step.field!.placeholder}
                            rows={(step.field as any)?.rows || 6}
                            className="text-base md:text-lg min-h-[150px] md:min-h-[180px] border-2 focus:ring-2 transition-all resize-y"
                            style={{ borderColor: (formData[step.field!.name] as string) ? BRAND.gold : '#e5e7eb' }}
                        />
                        <p className="text-xs text-gray-400 mt-2 text-right">
                            Write as much as you'd like — more detail helps!
                        </p>
                    </div>
                );

            case "file-upload":
                return (
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            {IconComponent && <IconComponent className="w-8 h-8" style={{ color: BRAND.burgundy }} />}
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">{step.title}</h2>
                                <p className="text-sm text-gray-500">{step.subtitle}</p>
                            </div>
                        </div>

                        {/* Photo previews */}
                        {photoPreviewUrls.length > 0 && (
                            <div className="flex gap-4 mb-4">
                                {photoPreviewUrls.map((url, i) => (
                                    <div key={i} className="relative">
                                        <Image
                                            src={url}
                                            alt={`Photo ${i + 1}`}
                                            width={120}
                                            height={120}
                                            className="rounded-lg object-cover"
                                        />
                                        <button
                                            onClick={() => removePhoto(i)}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {uploadedPhotos.length < 2 && (
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-gray-400 transition-colors"
                            >
                                <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                                <p className="text-gray-600">Click to upload photos</p>
                                <p className="text-sm text-gray-400 mt-1">Max 2 photos, 5MB each</p>
                            </div>
                        )}

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handlePhotoUpload}
                            className="hidden"
                        />
                    </div>
                );

            case "multi-select":
                const selectedValues = (formData[step.field!.name] as string[]) || [];
                return (
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            {IconComponent && <IconComponent className="w-8 h-8" style={{ color: BRAND.burgundy }} />}
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">{step.title}</h2>
                                <p className="text-sm text-gray-500">{step.subtitle}</p>
                            </div>
                        </div>
                        <div className="space-y-3">
                            {step.options?.map((option) => {
                                const isSelected = selectedValues.includes(option.value);
                                return (
                                    <button
                                        key={option.value}
                                        onClick={() => handleMultiSelectToggle(step.field!.name, option.value)}
                                        className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all ${isSelected
                                            ? "border-[#722F37] bg-[#722F3710]"
                                            : "border-gray-200 hover:border-gray-300"
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div
                                                className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${isSelected
                                                    ? "border-[#722F37] bg-[#722F37]"
                                                    : "border-gray-300"
                                                    }`}
                                            >
                                                {isSelected && <CheckCircle className="w-3 h-3 text-white" />}
                                            </div>
                                            <span className={isSelected ? "text-[#722F37] font-medium" : "text-gray-700"}>
                                                {option.label}
                                            </span>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    const isLastStep = currentStep === FORM_STEPS.length - 1;
    const isFirstStep = currentStep === 0;

    return (
        <div
            className="min-h-screen"
            style={{ background: `linear-gradient(to bottom right, ${BRAND.cream}, #f5f0e8)` }}
        >
            {/* Portal Navigation Header */}
            <header
                className="sticky top-0 z-50 px-4 py-3 border-b shadow-sm"
                style={{ backgroundColor: BRAND.burgundyDark, borderColor: BRAND.gold }}
            >
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Image
                            src="/accredipro-icon.webp"
                            alt="AccrediPro"
                            width={32}
                            height={32}
                            className="rounded"
                            onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                            }}
                        />
                        <span className="text-white font-bold text-sm md:text-base">
                            AccrediPro Academy
                        </span>
                    </div>
                    <a
                        href="/my-courses"
                        className="flex items-center gap-2 text-sm font-medium py-2 px-4 rounded-lg transition-colors"
                        style={{
                            color: BRAND.gold,
                            backgroundColor: `${BRAND.gold}15`,
                        }}
                    >
                        <BookOpen className="w-4 h-4" />
                        <span className="hidden sm:inline">Dashboard</span>
                    </a>
                </div>
            </header>

            {/* Main Content */}
            <div className="py-6 md:py-10 px-4">
                {/* Premium Card Container - wider on desktop */}
                <div className="max-w-2xl mx-auto">
                    <div
                        className="rounded-2xl overflow-hidden shadow-2xl"
                        style={{
                            background: "#fff",
                            boxShadow: `0 0 0 3px ${BRAND.gold}40, 0 25px 50px -12px rgba(114, 47, 55, 0.25)`,
                        }}
                    >
                        {/* Gold Metallic Header */}
                        <div
                            className="px-5 py-3 flex items-center justify-between"
                            style={{ background: BRAND.goldMetallic }}
                        >
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-bold" style={{ color: BRAND.burgundyDark }}>
                                    ✨ DFY Website Intake
                                </span>
                            </div>
                            <span
                                className="text-sm font-bold px-2 py-1 rounded-full"
                                style={{
                                    backgroundColor: `${BRAND.burgundyDark}20`,
                                    color: BRAND.burgundyDark
                                }}
                            >
                                {currentStep + 1} / {FORM_STEPS.length}
                            </span>
                        </div>

                        {/* Progress Bar with percentage */}
                        <div className="relative">
                            <div className="h-1.5 bg-gray-100">
                                <motion.div
                                    className="h-full"
                                    style={{ background: BRAND.burgundyGold }}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    transition={{ duration: 0.4, ease: "easeOut" }}
                                />
                            </div>
                            <div className="absolute right-3 -bottom-5 text-xs text-gray-400 font-medium">
                                {Math.round(progress)}% complete
                            </div>
                        </div>

                        {/* Form Content + Navigation inside card */}
                        <div className="p-6 md:p-10 pt-10">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentStep}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.25, ease: "easeOut" }}
                                    className="min-h-[350px] md:min-h-[400px]"
                                >
                                    {renderStepContent()}
                                </motion.div>
                            </AnimatePresence>

                            {/* Navigation - NOW INSIDE THE CARD */}
                            <div className="flex items-center justify-between pt-8 mt-6 border-t border-gray-100">
                                {!isFirstStep ? (
                                    <button
                                        onClick={handleBack}
                                        className="flex items-center gap-2 text-gray-500 hover:text-gray-700 font-medium transition-colors py-2"
                                    >
                                        <ArrowLeft className="w-4 h-4" />
                                        Back
                                    </button>
                                ) : (
                                    <div />
                                )}

                                {isLastStep ? (
                                    <div className="flex flex-col items-end gap-2">
                                        {submitError && (
                                            <p className="text-red-500 text-sm">{submitError}</p>
                                        )}
                                        <Button
                                            onClick={handleSubmit}
                                            disabled={loading}
                                            size="lg"
                                            className="h-12 px-8 text-base font-bold rounded-xl shadow-lg"
                                            style={{ background: BRAND.goldMetallic, color: BRAND.burgundyDark }}
                                        >
                                            {loading ? (
                                                <>
                                                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                                    Submitting...
                                                </>
                                            ) : (
                                                <>
                                                    Submit My Info
                                                    <CheckCircle className="w-5 h-5 ml-2" />
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                ) : (
                                    <Button
                                        onClick={handleNext}
                                        size="lg"
                                        className="h-12 px-8 text-base font-bold rounded-xl shadow-lg transition-all min-w-[160px]"
                                        style={{ background: BRAND.goldMetallic, color: BRAND.burgundyDark }}
                                    >
                                        {currentStepData.type === "intro" ? "Let's Start" : "Next"}
                                        <ArrowRight className="w-5 h-5 ml-2" />
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Wrapper with Suspense for useSearchParams (required in Next.js 16)
export default function DFYIntakeFormPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-[#722F37]" />
            </div>
        }>
            <DFYIntakeFormContent />
        </Suspense>
    );
}
