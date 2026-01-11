"use client";

import { useState, useEffect, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowRight,
  CheckCircle,
  Shield,
  Sparkles,
  Award
} from "lucide-react";

// ASI Brand Colors
const BRAND = {
  burgundy: "#722f37",
  burgundyDark: "#4e1f24",
  gold: "#d4af37",
  goldLight: "#e8c547",
  cream: "#fdf8f0",
};

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const registered = searchParams.get("registered");
  const reset = searchParams.get("reset");
  const expired = searchParams.get("expired");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Nuclear Cookie Cleaner: Run immediately to fix 494 errors
  useEffect(() => {
    // Only run if there are cookies
    if (document.cookie) {
      const cookies = document.cookie.split(';');
      let cleared = false;

      // Strategies to clear: standard, secure, and chunked suffixes
      const prefixes = [
        'next-auth.session-token',
        '__Secure-next-auth.session-token',
        'next-auth.csrf-token',
        '__Host-next-auth.csrf-token',
      ];

      cookies.forEach(cookie => {
        const name = cookie.trim().split('=')[0];

        // Check if this cookie matches any of our target prefixes
        if (prefixes.some(prefix => name.startsWith(prefix))) {
          // Delete it for root path
          document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
          // Also try deleting for current path just in case
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:01 GMT;`;

          // If it looks like a chunk (ends in .number), note it
          if (/\.\d+$/.test(name)) {
            console.log(`[LOGIN] Cleared chunked cookie: ${name}`);
            cleared = true;
          }
        }
      });

      if (cleared) {
        console.log("[LOGIN] Nuclear cleanup executed. Stale chunks removed.");
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      console.log("[LOGIN] Calling signIn...");
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      console.log("[LOGIN] signIn result:", JSON.stringify(result, null, 2));

      if (result?.error) {
        // Show the actual error message from NextAuth
        console.error("[LOGIN ERROR]", result.error);
        if (result.error === "CredentialsSignin") {
          setError("Invalid email or password. Please try again.");
        } else if (result.error === "Configuration") {
          // Additional cleanup on error
          console.log("[LOGIN] Configuration error - forcing cookie reset...");
          document.cookie.split(";").forEach(c => {
            const name = c.trim().split("=")[0];
            if (name.includes("next-auth")) {
              document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
            }
          });
          setError("Session reset. Please try again.");
        } else {
          setError(result.error);
        }
      } else if (result?.ok) {
        console.log("[LOGIN] Success! Checking user type for redirect...");

        // Check if user should go to lead portal
        try {
          const response = await fetch("/api/auth/get-redirect");
          const data = await response.json();
          const redirectUrl = data.redirectUrl || callbackUrl;
          console.log("[LOGIN] Redirecting to:", redirectUrl);
          router.push(redirectUrl);
        } catch (err) {
          // Fallback to default
          console.log("[LOGIN] Redirect check failed, using default:", callbackUrl);
          router.push(callbackUrl);
        }
        router.refresh();
      } else {
        console.error("[LOGIN] Unexpected result - no error but not ok:", result);
        setError("Login failed. Please try again.");
      }
    } catch (err: any) {
      console.error("[LOGIN EXCEPTION]", err?.message || err, err);
      setError(`An error occurred: ${err?.message || "Please try again."}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-sm">
      <CardContent className="p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-4" style={{ backgroundColor: `${BRAND.burgundy}10`, color: BRAND.burgundy }}>
            <Shield className="w-4 h-4" />
            Secure Login
          </div>
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
            Welcome Back
          </h2>
          <p className="text-gray-500">
            Sign in to continue your certification journey
          </p>
        </div>

        {/* Success Messages */}
        {registered && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm flex items-start gap-3">
            <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Account created successfully!</p>
              <p className="text-green-600">Please sign in with your credentials.</p>
            </div>
          </div>
        )}

        {reset && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm flex items-start gap-3">
            <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Password reset successful!</p>
              <p className="text-green-600">You can now sign in with your new password.</p>
            </div>
          </div>
        )}

        {expired && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-700 text-sm flex items-start gap-3">
            <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Session refreshed</p>
              <p className="text-amber-600">Please sign in again to continue.</p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-start gap-3 animate-shake">
            <div className="w-5 h-5 flex-shrink-0 rounded-full bg-red-100 flex items-center justify-center mt-0.5">
              <span className="text-red-600 text-xs font-bold">!</span>
            </div>
            <div>
              <p className="font-medium">Login failed</p>
              <p className="text-red-600">{error}</p>
            </div>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Input */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl transition-all bg-gray-50 focus:bg-white outline-none"
                style={{
                  boxShadow: 'none',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = BRAND.burgundy;
                  e.target.style.boxShadow = `0 0 0 3px ${BRAND.burgundy}20`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e5e7eb';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="w-full pl-12 pr-12 py-3.5 border border-gray-200 rounded-xl transition-all bg-gray-50 focus:bg-white outline-none"
                onFocus={(e) => {
                  e.target.style.borderColor = BRAND.burgundy;
                  e.target.style.boxShadow = `0 0 0 3px ${BRAND.burgundy}20`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e5e7eb';
                  e.target.style.boxShadow = 'none';
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 cursor-pointer"
                style={{ accentColor: BRAND.burgundy }}
              />
              <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
                Remember me
              </span>
            </label>
            <Link
              href="/forgot-password"
              className="text-sm font-medium hover:underline"
              style={{ color: BRAND.burgundy }}
            >
              Forgot password?
            </Link>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full py-6 text-base font-semibold rounded-xl shadow-lg transition-all hover:shadow-xl group"
            style={{
              background: `linear-gradient(to right, ${BRAND.burgundy}, ${BRAND.burgundyDark})`,
              boxShadow: `0 10px 25px -5px ${BRAND.burgundy}40`
            }}
            size="lg"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Signing in...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Sign In
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            )}
          </Button>
        </form>

        {/* Divider */}
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-4 text-gray-500">New to ASI?</span>
          </div>
        </div>

        {/* Register Link */}
        <Link
          href="/register"
          className="flex items-center justify-center gap-2 w-full py-3.5 border-2 rounded-xl font-medium transition-all group"
          style={{
            borderColor: `${BRAND.burgundy}30`,
            color: BRAND.burgundy
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = `${BRAND.burgundy}08`;
            e.currentTarget.style.borderColor = `${BRAND.burgundy}50`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.borderColor = `${BRAND.burgundy}30`;
          }}
        >
          <Award className="w-5 h-5" />
          Create your account
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>

        {/* Trust Badges */}
        <div className="mt-8 pt-6 border-t border-gray-100">
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

export default function LoginPage() {
  return (
    <Suspense fallback={
      <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-sm">
        <CardContent className="p-8">
          <div className="animate-pulse space-y-6">
            <div className="text-center">
              <div className="h-8 bg-gray-200 rounded w-48 mx-auto mb-2" />
              <div className="h-4 bg-gray-100 rounded w-64 mx-auto" />
            </div>
            <div className="space-y-4">
              <div className="h-12 bg-gray-100 rounded-xl" />
              <div className="h-12 bg-gray-100 rounded-xl" />
              <div className="h-12 rounded-xl" style={{ backgroundColor: `${BRAND.burgundy}20` }} />
            </div>
          </div>
        </CardContent>
      </Card>
    }>
      <LoginForm />
    </Suspense>
  );
}
