"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowRight,
  ArrowLeft,
  User,
  Target,
  BookOpen,
  Heart,
  Sparkles,
  CheckCircle,
  Loader2,
  Phone,
  MapPin,
  Clock,
} from "lucide-react";

interface OnboardingData {
  firstName: string;
  lastName: string;
  phone: string;
  location: string;
  timezone: string;
  healthBackground: string;
  certificationGoal: string;
  learningGoal: string;
  weeklyHours?: number;
  experienceLevel: string;
  focusAreas: string[];
}

interface OnboardingClientProps {
  userId: string;
  initialData: OnboardingData;
}

const focusAreaOptions = [
  { id: "functional-medicine", label: "Functional Medicine" },
  { id: "herbalism", label: "Herbalism & Herbal Medicine" },
  { id: "spiritual-healing", label: "Spiritual Healing" },
  { id: "womens-health", label: "Women's Health" },
  { id: "nutrition", label: "Nutrition & Diet" },
  { id: "mind-body", label: "Mind-Body Connection" },
  { id: "aromatherapy", label: "Aromatherapy" },
  { id: "energy-healing", label: "Energy Healing" },
  { id: "holistic-wellness", label: "Holistic Wellness" },
  { id: "integrative-health", label: "Integrative Health" },
];

const learningGoalOptions = [
  { value: "career-change", label: "Career Change - Start a new career in wellness" },
  { value: "add-to-practice", label: "Add to Practice - Expand my existing services" },
  { value: "personal-growth", label: "Personal Growth - Learn for myself and family" },
  { value: "side-business", label: "Side Business - Build a part-time wellness practice" },
];

const experienceLevelOptions = [
  { value: "beginner", label: "Beginner - New to health & wellness" },
  { value: "some-experience", label: "Some Experience - Taken a few courses" },
  { value: "professional", label: "Professional - Working in health field" },
  { value: "expert", label: "Expert - Certified practitioner" },
];

const weeklyHoursOptions = [
  { value: 2, label: "2-3 hours per week" },
  { value: 5, label: "5-7 hours per week" },
  { value: 10, label: "10-15 hours per week" },
  { value: 20, label: "20+ hours per week" },
];

const timezones = [
  { value: "America/New_York", label: "Eastern Time (ET)" },
  { value: "America/Chicago", label: "Central Time (CT)" },
  { value: "America/Denver", label: "Mountain Time (MT)" },
  { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
  { value: "America/Anchorage", label: "Alaska Time" },
  { value: "Pacific/Honolulu", label: "Hawaii Time" },
];

export function OnboardingClient({ userId, initialData }: OnboardingClientProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState<OnboardingData>(initialData);

  const totalSteps = 4;

  const updateData = (updates: Partial<OnboardingData>) => {
    setData((prev) => ({ ...prev, ...updates }));
  };

  const toggleFocusArea = (areaId: string) => {
    setData((prev) => ({
      ...prev,
      focusAreas: prev.focusAreas.includes(areaId)
        ? prev.focusAreas.filter((id) => id !== areaId)
        : [...prev.focusAreas, areaId],
    }));
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return data.firstName && data.lastName;
      case 2:
        return data.learningGoal && data.experienceLevel;
      case 3:
        return data.focusAreas.length > 0;
      case 4:
        return data.weeklyHours;
      default:
        return true;
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/user/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || "Failed to save profile");
      }

      router.push("/dashboard?welcome=true");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-burgundy-50 via-white to-gold-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-burgundy-600 to-burgundy-700 mb-4 shadow-lg">
            <Sparkles className="w-8 h-8 text-gold-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to AccrediPro!
          </h1>
          <p className="text-gray-500">
            Let&apos;s personalize your learning experience
          </p>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center gap-2 mb-8">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={`flex-1 h-2 rounded-full transition-colors ${
                i + 1 <= step ? "bg-burgundy-600" : "bg-gray-200"
              }`}
            />
          ))}
        </div>

        {/* Step Content */}
        <Card className="border-0 shadow-xl">
          <CardContent className="p-8">
            {/* Step 1: Basic Info */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-burgundy-100 flex items-center justify-center">
                    <User className="w-6 h-6 text-burgundy-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      Tell us about yourself
                    </h2>
                    <p className="text-gray-500 text-sm">
                      This helps us personalize your experience
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      First Name
                    </label>
                    <Input
                      value={data.firstName}
                      onChange={(e) => updateData({ firstName: e.target.value })}
                      placeholder="Jane"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Last Name
                    </label>
                    <Input
                      value={data.lastName}
                      onChange={(e) => updateData({ lastName: e.target.value })}
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Phone Number (optional)
                  </label>
                  <Input
                    value={data.phone}
                    onChange={(e) => updateData({ phone: e.target.value })}
                    placeholder="(555) 123-4567"
                    type="tel"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Location (optional)
                  </label>
                  <Input
                    value={data.location}
                    onChange={(e) => updateData({ location: e.target.value })}
                    placeholder="City, State"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Timezone
                  </label>
                  <Select
                    value={data.timezone}
                    onValueChange={(value) => updateData({ timezone: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      {timezones.map((tz) => (
                        <SelectItem key={tz.value} value={tz.value}>
                          {tz.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Step 2: Learning Goals */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                    <Target className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      Your Learning Goals
                    </h2>
                    <p className="text-gray-500 text-sm">
                      What brings you to AccrediPro?
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    What&apos;s your main goal?
                  </label>
                  <div className="grid gap-3">
                    {learningGoalOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => updateData({ learningGoal: option.value })}
                        className={`p-4 rounded-xl border-2 text-left transition-all ${
                          data.learningGoal === option.value
                            ? "border-burgundy-500 bg-burgundy-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              data.learningGoal === option.value
                                ? "border-burgundy-500 bg-burgundy-500"
                                : "border-gray-300"
                            }`}
                          >
                            {data.learningGoal === option.value && (
                              <CheckCircle className="w-3 h-3 text-white" />
                            )}
                          </div>
                          <span className="font-medium text-gray-900">
                            {option.label}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Experience Level
                  </label>
                  <Select
                    value={data.experienceLevel}
                    onValueChange={(value) => updateData({ experienceLevel: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your experience level" />
                    </SelectTrigger>
                    <SelectContent>
                      {experienceLevelOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Step 3: Focus Areas */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                    <Heart className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      Areas of Interest
                    </h2>
                    <p className="text-gray-500 text-sm">
                      Select all that interest you
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  {focusAreaOptions.map((area) => (
                    <button
                      key={area.id}
                      type="button"
                      onClick={() => toggleFocusArea(area.id)}
                      className="focus:outline-none"
                    >
                      <Badge
                        variant={data.focusAreas.includes(area.id) ? "default" : "outline"}
                        className={`px-4 py-2 text-sm cursor-pointer transition-all ${
                          data.focusAreas.includes(area.id)
                            ? "bg-burgundy-600 hover:bg-burgundy-700 text-white border-burgundy-600"
                            : "hover:bg-gray-100"
                        }`}
                      >
                        {data.focusAreas.includes(area.id) && (
                          <CheckCircle className="w-3 h-3 mr-1.5" />
                        )}
                        {area.label}
                      </Badge>
                    </button>
                  ))}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Tell us about your health & wellness background (optional)
                  </label>
                  <Textarea
                    value={data.healthBackground}
                    onChange={(e) => updateData({ healthBackground: e.target.value })}
                    placeholder="Share your journey, what inspired you to explore wellness, or any relevant experience..."
                    rows={4}
                  />
                </div>
              </div>
            )}

            {/* Step 4: Availability */}
            {step === 4 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      Learning Schedule
                    </h2>
                    <p className="text-gray-500 text-sm">
                      Help us recommend the right pace for you
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    How much time can you dedicate to learning per week?
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {weeklyHoursOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => updateData({ weeklyHours: option.value })}
                        className={`p-4 rounded-xl border-2 text-center transition-all ${
                          data.weeklyHours === option.value
                            ? "border-burgundy-500 bg-burgundy-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <span
                          className={`font-medium ${
                            data.weeklyHours === option.value
                              ? "text-burgundy-700"
                              : "text-gray-700"
                          }`}
                        >
                          {option.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    What certification are you most interested in? (optional)
                  </label>
                  <Input
                    value={data.certificationGoal}
                    onChange={(e) => updateData({ certificationGoal: e.target.value })}
                    placeholder="e.g., Certified Herbalist, Holistic Health Coach"
                  />
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
              {step > 1 ? (
                <Button
                  variant="outline"
                  onClick={() => setStep(step - 1)}
                  disabled={loading}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              ) : (
                <div />
              )}

              {step < totalSteps ? (
                <Button
                  onClick={() => setStep(step + 1)}
                  disabled={!canProceed()}
                  className="bg-burgundy-600 hover:bg-burgundy-700"
                >
                  Continue
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={loading || !canProceed()}
                  className="bg-burgundy-600 hover:bg-burgundy-700"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      Complete Setup
                      <Sparkles className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Skip option */}
        <div className="text-center mt-4">
          <Button
            variant="ghost"
            onClick={() => router.push("/dashboard")}
            className="text-gray-400 hover:text-gray-600"
          >
            Skip for now
          </Button>
        </div>
      </div>
    </div>
  );
}
