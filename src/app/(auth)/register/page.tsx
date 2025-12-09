"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  ArrowRight,
  Shield,
  Check,
  X,
  Sparkles
} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Password strength validation
  const passwordChecks = {
    length: formData.password.length >= 8,
    uppercase: /[A-Z]/.test(formData.password),
    lowercase: /[a-z]/.test(formData.password),
    number: /[0-9]/.test(formData.password),
  };

  const passwordStrength = Object.values(passwordChecks).filter(Boolean).length;
  const isPasswordValid = passwordChecks.length && passwordChecks.lowercase;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!isPasswordValid) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Registration failed");
        return;
      }

      router.push("/login?registered=true");
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 1) return "bg-red-500";
    if (passwordStrength === 2) return "bg-orange-500";
    if (passwordStrength === 3) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-sm">
      <CardContent className="p-8">
        {/* Logo for mobile */}
        <div className="lg:hidden text-center mb-6">
          <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-burgundy-600 to-burgundy-700 rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-xl">AP</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900">AccrediPro</h1>
        </div>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 rounded-full text-green-600 text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            Join for Free
          </div>
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
            Create Your Account
          </h2>
          <p className="text-gray-500">
            Start your journey to educational excellence
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-start gap-3">
            <div className="w-5 h-5 flex-shrink-0 rounded-full bg-red-100 flex items-center justify-center mt-0.5">
              <X className="w-3 h-3 text-red-600" />
            </div>
            <div>
              <p className="font-medium">Registration failed</p>
              <p className="text-red-600">{error}</p>
            </div>
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="firstName"
                  placeholder="Jane"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  autoComplete="given-name"
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-burgundy-500 focus:border-burgundy-500 transition-all bg-gray-50 focus:bg-white"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  autoComplete="family-name"
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-burgundy-500 focus:border-burgundy-500 transition-all bg-gray-50 focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                autoComplete="email"
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-burgundy-500 focus:border-burgundy-500 transition-all bg-gray-50 focus:bg-white"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Create a strong password"
                value={formData.password}
                onChange={handleChange}
                required
                autoComplete="new-password"
                className="w-full pl-12 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-burgundy-500 focus:border-burgundy-500 transition-all bg-gray-50 focus:bg-white"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* Password Strength Indicator */}
            {formData.password && (
              <div className="mt-3 space-y-2">
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map((level) => (
                    <div
                      key={level}
                      className={`h-1 flex-1 rounded-full transition-colors ${
                        passwordStrength >= level ? getPasswordStrengthColor() : "bg-gray-200"
                      }`}
                    />
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className={`flex items-center gap-1.5 ${passwordChecks.length ? "text-green-600" : "text-gray-400"}`}>
                    {passwordChecks.length ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                    8+ characters
                  </div>
                  <div className={`flex items-center gap-1.5 ${passwordChecks.uppercase ? "text-green-600" : "text-gray-400"}`}>
                    {passwordChecks.uppercase ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                    Uppercase
                  </div>
                  <div className={`flex items-center gap-1.5 ${passwordChecks.lowercase ? "text-green-600" : "text-gray-400"}`}>
                    {passwordChecks.lowercase ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                    Lowercase
                  </div>
                  <div className={`flex items-center gap-1.5 ${passwordChecks.number ? "text-green-600" : "text-gray-400"}`}>
                    {passwordChecks.number ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                    Number
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                autoComplete="new-password"
                className={`w-full pl-12 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-burgundy-500 focus:border-burgundy-500 transition-all bg-gray-50 focus:bg-white ${
                  formData.confirmPassword && formData.password !== formData.confirmPassword
                    ? "border-red-300"
                    : formData.confirmPassword && formData.password === formData.confirmPassword
                    ? "border-green-300"
                    : "border-gray-200"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {formData.confirmPassword && formData.password !== formData.confirmPassword && (
              <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                <X className="w-3 h-3" /> Passwords do not match
              </p>
            )}
            {formData.confirmPassword && formData.password === formData.confirmPassword && (
              <p className="mt-1.5 text-xs text-green-600 flex items-center gap-1">
                <Check className="w-3 h-3" /> Passwords match
              </p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full py-6 text-base font-semibold rounded-xl bg-gradient-to-r from-burgundy-600 to-burgundy-700 hover:from-burgundy-700 hover:to-burgundy-800 shadow-lg shadow-burgundy-500/25 transition-all hover:shadow-xl hover:shadow-burgundy-500/30 group mt-2"
            size="lg"
            disabled={loading || !isPasswordValid || formData.password !== formData.confirmPassword}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Creating Account...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Create Account
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            )}
          </Button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-4 text-gray-500">Already have an account?</span>
          </div>
        </div>

        {/* Login Link */}
        <Link
          href="/login"
          className="flex items-center justify-center gap-2 w-full py-3.5 border-2 border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 hover:border-gray-300 transition-all group"
        >
          Sign in instead
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>

        {/* Trust Badges */}
        <div className="mt-6 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-center gap-6 text-gray-400 text-xs">
            <div className="flex items-center gap-1.5">
              <Shield className="w-4 h-4" />
              <span>SSL Secured</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Lock className="w-4 h-4" />
              <span>256-bit Encryption</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
