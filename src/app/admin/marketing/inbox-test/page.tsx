"use client";

import { useState, useEffect } from "react";

interface Variant {
  id: number;
  name: string;
  day: number;
  originalSubject: string;
  subject: string;
  contentPreview: string;
  section?: string;
}

interface FullVariant extends Variant {
  content: string;
  html: string;
}

interface TestResult {
  variantId: number;
  success: boolean;
  timestamp: string;
  landedIn?: "Primary" | "Promotions" | "Updates" | "Spam" | "Unknown";
}

export default function InboxTestPage() {
  const [variants, setVariants] = useState<Variant[]>([]);
  const [testEmail, setTestEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState<number | null>(null);
  const [sendingAll, setSendingAll] = useState(false);
  const [sendAllProgress, setSendAllProgress] = useState<{ current: number; total: number } | null>(null);
  const [results, setResults] = useState<TestResult[]>([]);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [activeSection, setActiveSection] = useState<"all" | "nurture" | "mini_diploma" | "mini_diploma_nurturing" | "wh_nurture_v2" | "fm_completion" | "fm_nurture_v4" | "buyer_retention">("all");

  // Modal state
  const [modalVariant, setModalVariant] = useState<FullVariant | null>(null);
  const [modalTab, setModalTab] = useState<"preview" | "raw">("preview");
  const [loadingModal, setLoadingModal] = useState(false);

  // Filter variants by section
  const filteredVariants = variants.filter(v => {
    if (activeSection === "all") return true;
    if (activeSection === "mini_diploma") return v.section === "mini_diploma" || (v.id >= 100 && v.id <= 108);
    if (activeSection === "mini_diploma_nurturing") return v.section === "mini_diploma_nurturing" || (v.id >= 200 && v.id <= 220);
    if (activeSection === "wh_nurture_v2") return v.section === "wh_nurture_v2" || (v.id >= 300 && v.id < 400);
    if (activeSection === "fm_completion") return v.section === "fm_completion" || (v.id >= 400 && v.id < 500);
    if (activeSection === "fm_nurture_v4") return v.section === "fm_nurture_v4" || (v.id >= 500 && v.id < 600);
    if (activeSection === "buyer_retention") return v.section === "buyer_retention";
    if (activeSection === "nurture") return !v.section && v.id < 100;
    return true;
  });

  useEffect(() => {
    fetchVariants();
  }, []);

  const fetchVariants = async () => {
    try {
      const res = await fetch("/api/admin/marketing/inbox-test");
      const data = await res.json();
      setVariants(data.variants || []);
    } catch (error) {
      console.error("Error fetching variants:", error);
    } finally {
      setLoading(false);
    }
  };

  const sendTest = async (variantId: number) => {
    if (!testEmail) {
      setMessage({ type: "error", text: "Please enter your test email address" });
      return;
    }

    setSending(variantId);
    setMessage(null);

    try {
      const res = await fetch("/api/admin/marketing/inbox-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ variantId, testEmail }),
      });

      const data = await res.json();

      if (data.success) {
        setMessage({
          type: "success",
          text: `Email ${variantId} (Day ${data.day}) sent! Check your inbox in 30-60 seconds.`,
        });
        setResults(prev => [
          ...prev,
          { variantId, success: true, timestamp: new Date().toLocaleTimeString() },
        ]);
      } else {
        setMessage({ type: "error", text: data.error || "Failed to send" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to send test email" });
    } finally {
      setSending(null);
    }
  };

  const markResult = (variantId: number, landedIn: TestResult["landedIn"]) => {
    setResults(prev =>
      prev.map(r =>
        r.variantId === variantId ? { ...r, landedIn } : r
      )
    );
  };

  // Open preview modal with full content
  const openPreview = async (variantId: number) => {
    setLoadingModal(true);
    setModalTab("preview");
    try {
      const res = await fetch(`/api/admin/marketing/inbox-test?variantId=${variantId}`);
      const data = await res.json();
      if (data.id) {
        setModalVariant(data);
      }
    } catch (error) {
      console.error("Error fetching variant:", error);
    } finally {
      setLoadingModal(false);
    }
  };

  const closeModal = () => {
    setModalVariant(null);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setMessage({ type: "success", text: "Copied to clipboard!" });
      setTimeout(() => setMessage(null), 2000);
    } catch (err) {
      setMessage({ type: "error", text: "Failed to copy" });
    }
  };

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const sendAllEmails = async () => {
    if (!testEmail) {
      setMessage({ type: "error", text: "Please enter your test email address" });
      return;
    }

    setSendingAll(true);
    setMessage(null);
    const total = filteredVariants.length;

    for (let i = 0; i < filteredVariants.length; i++) {
      const variant = filteredVariants[i];
      setSendAllProgress({ current: i + 1, total });
      setSending(variant.id);

      try {
        const res = await fetch("/api/admin/marketing/inbox-test", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ variantId: variant.id, testEmail }),
        });

        const data = await res.json();

        if (data.success) {
          setResults(prev => [
            ...prev,
            { variantId: variant.id, success: true, timestamp: new Date().toLocaleTimeString() },
          ]);
        }
      } catch (error) {
        console.error(`Failed to send email ${variant.id}:`, error);
      }

      // Wait 2 seconds before sending next email (except for the last one)
      if (i < filteredVariants.length - 1) {
        await delay(2000);
      }
    }

    setSending(null);
    setSendingAll(false);
    setSendAllProgress(null);
    setMessage({
      type: "success",
      text: `All ${total} emails sent! Check your inbox and mark where each one landed.`
    });
  };

  const getResultForVariant = (variantId: number) => {
    return results.find(r => r.variantId === variantId);
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">Loading email variants...</div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Nurture Sequence - Gmail Primary Test
        </h1>
        <p className="text-gray-600">
          Test all 17 nurture sequence emails with optimized Re: subjects.
          Send each one and verify it lands in Primary inbox before updating the live sequence.
        </p>
        <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
          <strong>Goal:</strong> All 17 emails must land in Primary. Any that land in Promotions/Spam need subject tweaks.
        </div>
      </div>

      {/* Section Tabs */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveSection("all")}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${activeSection === "all"
              ? "bg-burgundy-600 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
          >
            All ({variants.length})
          </button>
          <button
            onClick={() => setActiveSection("nurture")}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${activeSection === "nurture"
              ? "bg-burgundy-600 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
          >
            Nurture Sequence ({variants.filter(v => !v.section && v.id < 100).length})
          </button>
          <button
            onClick={() => setActiveSection("mini_diploma")}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${activeSection === "mini_diploma"
              ? "bg-emerald-600 text-white"
              : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
              }`}
          >
            Mini Diploma ({variants.filter(v => v.section === "mini_diploma" || (v.id >= 100 && v.id <= 108)).length})
          </button>
          <button
            onClick={() => setActiveSection("mini_diploma_nurturing")}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${activeSection === "mini_diploma_nurturing"
              ? "bg-purple-600 text-white"
              : "bg-purple-100 text-purple-700 hover:bg-purple-200"
              }`}
          >
            WH Nurturing ({variants.filter(v => v.section === "mini_diploma_nurturing" || (v.id >= 200 && v.id <= 220)).length})
          </button>
          <button
            onClick={() => setActiveSection("wh_nurture_v2")}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${activeSection === "wh_nurture_v2"
              ? "bg-green-600 text-white"
              : "bg-green-100 text-green-700 hover:bg-green-200"
              }`}
          >
            WH v2 60-Day ({variants.filter(v => v.section === "wh_nurture_v2" || (v.id >= 300 && v.id < 400)).length})
          </button>
          <button
            onClick={() => setActiveSection("fm_completion")}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${activeSection === "fm_completion"
              ? "bg-rose-600 text-white"
              : "bg-rose-100 text-rose-700 hover:bg-rose-200"
              }`}
          >
            FM Completion ({variants.filter(v => v.section === "fm_completion" || (v.id >= 400 && v.id < 500)).length})
          </button>
          <button
            onClick={() => setActiveSection("fm_nurture_v4")}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${activeSection === "fm_nurture_v4"
              ? "bg-orange-600 text-white"
              : "bg-orange-100 text-orange-700 hover:bg-orange-200"
              }`}
          >
            FM Nurture v4 ({variants.filter(v => v.section === "fm_nurture_v4" || (v.id >= 500 && v.id < 600)).length})
          </button>
          <button
            onClick={() => setActiveSection("buyer_retention")}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${activeSection === "buyer_retention"
              ? "bg-teal-600 text-white"
              : "bg-teal-100 text-teal-700 hover:bg-teal-200"
              }`}
          >
            Buyer Retention ({variants.filter(v => v.section === "buyer_retention").length})
          </button>
        </div>
      </div>

      {/* Test Email Input */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Your Gmail Test Address
        </label>
        <div className="flex gap-4">
          <input
            type="email"
            value={testEmail}
            onChange={e => setTestEmail(e.target.value)}
            placeholder="your@gmail.com"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy-500 focus:border-burgundy-500"
          />
          <button
            onClick={sendAllEmails}
            disabled={sendingAll || !testEmail || filteredVariants.length === 0}
            className={`px-6 py-2 rounded-lg font-medium text-sm whitespace-nowrap ${sendingAll
              ? "bg-amber-100 text-amber-700 cursor-wait"
              : !testEmail
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-green-600 text-white hover:bg-green-700"
              }`}
          >
            {sendingAll
              ? `Sending ${sendAllProgress?.current}/${sendAllProgress?.total}...`
              : `Send All (${filteredVariants.length} emails)`}
          </button>
        </div>
        <p className="mt-2 text-sm text-gray-500">
          Use a Gmail address to test inbox placement. "Send All" sends each email with a 2-second delay.
        </p>
        {sendingAll && (
          <div className="mt-3">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((sendAllProgress?.current || 0) / (sendAllProgress?.total || 1)) * 100}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1 text-center">
              Sending email {sendAllProgress?.current} of {sendAllProgress?.total}...
            </p>
          </div>
        )}
      </div>

      {/* Message */}
      {
        message && (
          <div
            className={`mb-6 p-4 rounded-lg ${message.type === "success"
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
              }`}
          >
            {message.text}
          </div>
        )
      }

      {/* Results Summary */}
      {
        results.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-lg font-semibold mb-4">Test Results ({results.length}/{variants.length} tested)</h2>
            <div className="grid grid-cols-5 gap-2">
              <div className="text-center p-2 bg-green-100 rounded">
                <div className="text-2xl font-bold text-green-700">
                  {results.filter(r => r.landedIn === "Primary").length}
                </div>
                <div className="text-xs text-green-600">Primary</div>
              </div>
              <div className="text-center p-2 bg-yellow-100 rounded">
                <div className="text-2xl font-bold text-yellow-700">
                  {results.filter(r => r.landedIn === "Promotions").length}
                </div>
                <div className="text-xs text-yellow-600">Promotions</div>
              </div>
              <div className="text-center p-2 bg-blue-100 rounded">
                <div className="text-2xl font-bold text-blue-700">
                  {results.filter(r => r.landedIn === "Updates").length}
                </div>
                <div className="text-xs text-blue-600">Updates</div>
              </div>
              <div className="text-center p-2 bg-red-100 rounded">
                <div className="text-2xl font-bold text-red-700">
                  {results.filter(r => r.landedIn === "Spam").length}
                </div>
                <div className="text-xs text-red-600">Spam</div>
              </div>
              <div className="text-center p-2 bg-gray-100 rounded">
                <div className="text-2xl font-bold text-gray-700">
                  {results.filter(r => !r.landedIn).length}
                </div>
                <div className="text-xs text-gray-600">Pending</div>
              </div>
            </div>
          </div>
        )
      }

      {/* Variants Grid */}
      <div className="space-y-4">
        {filteredVariants.map(variant => {
          const result = getResultForVariant(variant.id);
          return (
            <div
              key={variant.id}
              className={`bg-white rounded-lg shadow p-6 border-l-4 ${result?.landedIn === "Primary"
                ? "border-green-500"
                : result?.landedIn === "Promotions"
                  ? "border-yellow-500"
                  : result?.landedIn === "Updates"
                    ? "border-blue-500"
                    : result?.landedIn === "Spam"
                      ? "border-red-500"
                      : "border-gray-200"
                }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-burgundy-100 text-burgundy-700 font-bold text-sm">
                      {variant.id}
                    </span>
                    <span className="px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 rounded">
                      Day {variant.day}
                    </span>
                    <h3 className="font-semibold text-gray-900">{variant.name}</h3>
                    {result?.landedIn && (
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded ${result.landedIn === "Primary"
                          ? "bg-green-100 text-green-700"
                          : result.landedIn === "Promotions"
                            ? "bg-yellow-100 text-yellow-700"
                            : result.landedIn === "Updates"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-red-100 text-red-700"
                          }`}
                      >
                        {result.landedIn}
                      </span>
                    )}
                  </div>

                  {/* Subject Comparison */}
                  <div className="mb-3 space-y-1">
                    <div className="text-sm">
                      <span className="text-gray-500">Original:</span>{" "}
                      <span className="text-gray-400 line-through">{variant.originalSubject}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-500">Optimized:</span>{" "}
                      <span className="font-medium text-green-700">{variant.subject}</span>
                    </div>
                  </div>

                  {/* Content Preview */}
                  <p className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                    {variant.contentPreview}
                  </p>
                </div>
                <div className="ml-4 flex flex-col gap-2">
                  <button
                    onClick={() => openPreview(variant.id)}
                    className="px-4 py-2 rounded-lg font-medium text-sm bg-gray-100 text-gray-700 hover:bg-gray-200"
                  >
                    👁 View
                  </button>
                  <button
                    onClick={() => sendTest(variant.id)}
                    disabled={sending !== null || sendingAll || !testEmail}
                    className={`px-4 py-2 rounded-lg font-medium text-sm ${sending === variant.id
                      ? "bg-amber-100 text-amber-700 cursor-wait"
                      : sendingAll || !testEmail
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-burgundy-600 text-white hover:bg-burgundy-700"
                      }`}
                  >
                    {sending === variant.id ? "Sending..." : "Send Test"}
                  </button>
                </div>
              </div>

              {/* Result Buttons - Show after sending */}
              {result && !result.landedIn && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-600 mb-2">Where did it land?</p>
                  <div className="flex gap-2">
                    {(["Primary", "Promotions", "Updates", "Spam"] as const).map(tab => (
                      <button
                        key={tab}
                        onClick={() => markResult(variant.id, tab)}
                        className={`px-3 py-1 text-sm rounded ${tab === "Primary"
                          ? "bg-green-100 text-green-700 hover:bg-green-200"
                          : tab === "Promotions"
                            ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                            : tab === "Updates"
                              ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                              : "bg-red-100 text-red-700 hover:bg-red-200"
                          }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Tips Section */}
      <div className="mt-8 bg-amber-50 rounded-lg p-6 border border-amber-200">
        <h3 className="font-semibold text-amber-800 mb-3">Testing Protocol</h3>
        <ul className="text-sm text-amber-700 space-y-2">
          <li>1. Send one email at a time. Wait 30-60 seconds before checking inbox.</li>
          <li>2. Check all tabs: Primary, Promotions, Updates, Social, and Spam.</li>
          <li>3. All emails use "Re:" subjects - proven to land in Primary for long-form content.</li>
          <li>4. If any land in Promotions/Spam, note the email number and we will adjust the subject.</li>
          <li>5. Goal: 17/17 in Primary before going live with the sequence.</li>
          <li>6. Content is cleaned: no emojis, no markdown, simple signatures.</li>
          <li>7. FROM: "Sarah" - personal name, not company branding.</li>
        </ul>
      </div>

      {/* Progress Tracker */}
      {
        results.length > 0 && results.every(r => r.landedIn === "Primary") && results.length === variants.length && (
          <div className="mt-6 p-4 bg-green-100 border border-green-300 rounded-lg text-center">
            <div className="text-2xl mb-2">{variants.length}/{variants.length} Primary!</div>
            <p className="text-green-800">All emails passed! Ready to update the live nurture sequence.</p>
          </div>
        )
      }

      {/* Email Preview Modal */}
      {(modalVariant || loadingModal) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  {loadingModal ? "Loading..." : modalVariant?.name}
                </h2>
                {modalVariant && (
                  <p className="text-sm text-gray-500">Day {modalVariant.day} • {modalVariant.subject}</p>
                )}
              </div>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-lg text-gray-500"
              >
                ✕
              </button>
            </div>

            {/* Modal Tabs */}
            {modalVariant && (
              <>
                <div className="flex border-b px-4">
                  <button
                    onClick={() => setModalTab("preview")}
                    className={`px-4 py-3 font-medium text-sm border-b-2 -mb-px ${modalTab === "preview"
                      ? "border-burgundy-600 text-burgundy-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                      }`}
                  >
                    Preview
                  </button>
                  <button
                    onClick={() => setModalTab("raw")}
                    className={`px-4 py-3 font-medium text-sm border-b-2 -mb-px ${modalTab === "raw"
                      ? "border-burgundy-600 text-burgundy-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                      }`}
                  >
                    Raw Text
                  </button>
                </div>

                {/* Modal Content */}
                <div className="flex-1 overflow-y-auto p-4">
                  {modalTab === "preview" ? (
                    <div
                      className="prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: modalVariant.html }}
                    />
                  ) : (
                    <div className="relative">
                      <button
                        onClick={() => copyToClipboard(modalVariant.content)}
                        className="absolute top-2 right-2 px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded font-medium"
                      >
                        📋 Copy
                      </button>
                      <pre className="bg-gray-50 p-4 rounded-lg text-sm whitespace-pre-wrap font-mono overflow-x-auto">
                        {modalVariant.content}
                      </pre>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div >
  );
}
