"use client";

import { useState } from "react";

interface VerificationResult {
  isValid: boolean;
  result: string;
  suggestedEmail?: string;
  reason?: string;
  localChecks: {
    syntaxValid: boolean;
    isDisposable: boolean;
  };
  apiResponse?: Record<string, unknown>;
}

export default function EmailTestPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [error, setError] = useState("");

  const testEmail = async () => {
    if (!email.trim()) {
      setError("Please enter an email address");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/admin/email-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json();

      if (data.success) {
        setResult(data.result);
      } else {
        setError(data.error || "Failed to verify email");
      }
    } catch (err) {
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getResultColor = (result: string) => {
    switch (result) {
      case "valid":
        return "bg-green-100 text-green-800";
      case "invalid":
        return "bg-red-100 text-red-800";
      case "disposable":
        return "bg-orange-100 text-orange-800";
      case "catchall":
        return "bg-yellow-100 text-yellow-800";
      case "unknown":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          NeverBounce Email Test
        </h1>
        <p className="text-gray-600 mb-8">
          Test email validation without creating a user account
        </p>

        {/* Test Form */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address to Test
          </label>
          <div className="flex gap-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && testEmail()}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy-500"
              placeholder="test@example.com"
            />
            <button
              onClick={testEmail}
              disabled={loading}
              className="px-6 py-3 bg-burgundy-600 text-white rounded-lg hover:bg-burgundy-700 disabled:opacity-50"
            >
              {loading ? "Testing..." : "Test Email"}
            </button>
          </div>

          {/* Quick Test Examples */}
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="text-sm text-gray-500">Quick tests:</span>
            {[
              "test@gmail.com",
              "test@gmial.com",
              "fake@mailinator.com",
              "invalid@",
              "test@hotmail.com",
            ].map((testEmail) => (
              <button
                key={testEmail}
                onClick={() => setEmail(testEmail)}
                className="text-xs px-2 py-1 bg-gray-100 rounded hover:bg-gray-200"
              >
                {testEmail}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-8">
            {error}
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Verification Result
            </h3>

            {/* Main Result */}
            <div className="mb-6">
              <div className="flex items-center gap-4 mb-2">
                <span
                  className={`px-4 py-2 rounded-lg font-semibold ${getResultColor(
                    result.result
                  )}`}
                >
                  {result.result.toUpperCase()}
                </span>
                <span
                  className={`text-lg font-bold ${
                    result.isValid ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {result.isValid ? "ALLOWED" : "BLOCKED"}
                </span>
              </div>
              {result.reason && (
                <p className="text-gray-600">{result.reason}</p>
              )}
            </div>

            {/* Suggested Email */}
            {result.suggestedEmail && (
              <div className="mb-6 bg-yellow-50 p-4 rounded-lg">
                <span className="font-medium text-yellow-800">
                  Suggested correction:{" "}
                </span>
                <span className="font-mono text-yellow-900">
                  {result.suggestedEmail}
                </span>
              </div>
            )}

            {/* Local Checks */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-700 mb-2">Local Checks</h4>
              <div className="grid grid-cols-2 gap-4">
                <div
                  className={`p-3 rounded ${
                    result.localChecks.syntaxValid
                      ? "bg-green-50"
                      : "bg-red-50"
                  }`}
                >
                  <span className="text-sm">Syntax Valid:</span>{" "}
                  <span className="font-semibold">
                    {result.localChecks.syntaxValid ? "Yes" : "No"}
                  </span>
                </div>
                <div
                  className={`p-3 rounded ${
                    result.localChecks.isDisposable
                      ? "bg-red-50"
                      : "bg-green-50"
                  }`}
                >
                  <span className="text-sm">Disposable:</span>{" "}
                  <span className="font-semibold">
                    {result.localChecks.isDisposable ? "Yes (blocked)" : "No"}
                  </span>
                </div>
              </div>
            </div>

            {/* Raw API Response */}
            {result.apiResponse && (
              <div>
                <h4 className="font-medium text-gray-700 mb-2">
                  Raw NeverBounce Response
                </h4>
                <pre className="bg-gray-100 p-4 rounded-lg text-xs overflow-auto">
                  {JSON.stringify(result.apiResponse, null, 2)}
                </pre>
              </div>
            )}

            {/* Legend */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="font-medium text-gray-700 mb-2">Result Types</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="font-semibold text-green-700">valid</span> -
                  Email is deliverable
                </div>
                <div>
                  <span className="font-semibold text-red-700">invalid</span> -
                  Email does not exist
                </div>
                <div>
                  <span className="font-semibold text-orange-700">
                    disposable
                  </span>{" "}
                  - Temporary email (blocked)
                </div>
                <div>
                  <span className="font-semibold text-yellow-700">catchall</span>{" "}
                  - Domain accepts all (allowed)
                </div>
                <div>
                  <span className="font-semibold text-gray-700">unknown</span> -
                  Could not verify (allowed)
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
