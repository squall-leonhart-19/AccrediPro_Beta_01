"use client";

import { useState, useEffect } from "react";
import { WelcomeVideoStep } from "@/components/lead-portal/WelcomeVideoStep";
import { OnboardingQuestionsStep } from "@/components/lead-portal/OnboardingQuestionsStep";
import { LeadStepChecklist } from "@/components/lead-portal/LeadStepChecklist";
import { CertificateClaimStep } from "@/components/lead-portal/CertificateClaimStep";
import { Loader2 } from "lucide-react";

interface OnboardingData {
    watchedVideo: boolean;
    completedQuestions: boolean;
    claimedCertificate: boolean;
    leftReview: boolean;
}

interface LeadOnboardingWrapperProps {
    firstName: string;
    lastName: string;
    userAvatar?: string | null;
    initialOnboarding: OnboardingData | null;
    completedLessons: number[];
    children: React.ReactNode; // The existing lesson content
}

export function LeadOnboardingWrapper({
    firstName,
    lastName,
    userAvatar,
    initialOnboarding,
    completedLessons,
    children,
}: LeadOnboardingWrapperProps) {
    const [onboarding, setOnboarding] = useState<OnboardingData>({
        watchedVideo: initialOnboarding?.watchedVideo ?? false,
        completedQuestions: initialOnboarding?.completedQuestions ?? false,
        claimedCertificate: initialOnboarding?.claimedCertificate ?? false,
        leftReview: initialOnboarding?.leftReview ?? false,
    });

    const [currentStep, setCurrentStep] = useState<number>(1);

    // Calculate current step based on progress
    useEffect(() => {
        if (!onboarding.watchedVideo) {
            setCurrentStep(1);
        } else if (!onboarding.completedQuestions) {
            setCurrentStep(2);
        } else if (completedLessons.length < 9) {
            // First incomplete lesson (steps 3-11)
            for (let i = 1; i <= 9; i++) {
                if (!completedLessons.includes(i)) {
                    setCurrentStep(i + 2);
                    break;
                }
            }
        } else {
            setCurrentStep(12);
        }
    }, [onboarding, completedLessons]);

    // Build 12 steps for checklist
    const steps = [
        { id: 1, title: "Watch Welcome Video", completed: onboarding.watchedVideo },
        { id: 2, title: "Tell Us About You", completed: onboarding.completedQuestions },
        { id: 3, title: "Lesson 1: Meet Your Hormones", completed: completedLessons.includes(1) },
        { id: 4, title: "Lesson 2: The Monthly Dance", completed: completedLessons.includes(2) },
        { id: 5, title: "Lesson 3: When Hormones Go Rogue", completed: completedLessons.includes(3) },
        { id: 6, title: "Lesson 4: The Gut-Hormone Axis", completed: completedLessons.includes(4) },
        { id: 7, title: "Lesson 5: Thyroid & Energy", completed: completedLessons.includes(5) },
        { id: 8, title: "Lesson 6: Stress & Your Adrenals", completed: completedLessons.includes(6) },
        { id: 9, title: "Lesson 7: Food as Medicine", completed: completedLessons.includes(7) },
        { id: 10, title: "Lesson 8: Life Stage Support", completed: completedLessons.includes(8) },
        { id: 11, title: "Lesson 9: Your Next Step", completed: completedLessons.includes(9) },
        { id: 12, title: "Claim Certificate & Review", completed: onboarding.claimedCertificate && onboarding.leftReview },
    ];

    const completedCount = steps.filter(s => s.completed).length;
    const progress = Math.round((completedCount / steps.length) * 100);

    const handleVideoComplete = () => {
        setOnboarding(prev => ({ ...prev, watchedVideo: true }));
        setCurrentStep(2);
    };

    const handleQuestionsComplete = () => {
        setOnboarding(prev => ({ ...prev, completedQuestions: true }));
        setCurrentStep(3);
    };

    const handleClaimCertificate = async () => {
        try {
            // This would call an API to generate and claim the certificate
            setOnboarding(prev => ({ ...prev, claimedCertificate: true }));
        } catch (error) {
            console.error("Error claiming certificate:", error);
        }
    };

    const handleReviewComplete = async () => {
        try {
            await fetch("/api/lead-onboarding/review-complete", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ platform: "trustpilot" }),
            });
            setOnboarding(prev => ({ ...prev, leftReview: true }));
        } catch (error) {
            console.error("Error marking review complete:", error);
        }
    };

    // Step 1: Welcome Video
    if (currentStep === 1) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-burgundy-50 via-white to-gray-50">
                <div className="max-w-2xl mx-auto px-4 py-8">
                    <div className="mb-8">
                        <LeadStepChecklist
                            steps={steps}
                            currentStep={currentStep}
                            progress={progress}
                            lessonBaseUrl="/womens-health-diploma/lesson"
                        />
                    </div>
                    <WelcomeVideoStep
                        onComplete={handleVideoComplete}
                        isCompleted={onboarding.watchedVideo}
                        firstName={firstName}
                    />
                </div>
            </div>
        );
    }

    // Step 2: Onboarding Questions
    if (currentStep === 2) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-burgundy-50 via-white to-gray-50">
                <div className="max-w-2xl mx-auto px-4 py-8">
                    <div className="mb-8">
                        <LeadStepChecklist
                            steps={steps}
                            currentStep={currentStep}
                            progress={progress}
                            lessonBaseUrl="/womens-health-diploma/lesson"
                        />
                    </div>
                    <OnboardingQuestionsStep
                        onComplete={handleQuestionsComplete}
                        isCompleted={onboarding.completedQuestions}
                        firstName={firstName}
                        userAvatar={userAvatar}
                    />
                </div>
            </div>
        );
    }

    // Step 12: Certificate & Review
    if (currentStep === 12) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-burgundy-50 via-white to-gray-50">
                <div className="max-w-2xl mx-auto px-4 py-8">
                    <div className="mb-8">
                        <LeadStepChecklist
                            steps={steps}
                            currentStep={currentStep}
                            progress={progress}
                            lessonBaseUrl="/womens-health-diploma/lesson"
                        />
                    </div>
                    <CertificateClaimStep
                        firstName={firstName}
                        lastName={lastName}
                        diplomaName="Women's Health & Hormones"
                        hasClaimedCertificate={onboarding.claimedCertificate}
                        hasLeftReview={onboarding.leftReview}
                        onClaimCertificate={handleClaimCertificate}
                        onReviewComplete={handleReviewComplete}
                    />
                </div>
            </div>
        );
    }

    // Steps 3-11: Lessons (show existing lesson content with checklist)
    return (
        <div className="min-h-screen bg-gradient-to-b from-burgundy-50 via-white to-gray-50">
            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Step Checklist */}
                <div className="mb-8">
                    <LeadStepChecklist
                        steps={steps}
                        currentStep={currentStep}
                        progress={progress}
                        lessonBaseUrl="/womens-health-diploma/lesson"
                    />
                </div>
                {/* Original lesson content */}
                {children}
            </div>
        </div>
    );
}
