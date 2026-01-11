"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  Shield,
  Search,
  CheckCircle,
  XCircle,
  MapPin,
  Award,
  Calendar,
  User,
  AlertCircle,
  Loader2,
} from "lucide-react";

const BRAND = {
  burgundy: "#722f37",
  burgundyDark: "#4e1f24",
  gold: "#d4af37",
  goldLight: "#e8c547",
  cream: "#fdf8f0",
  goldMetallic: "linear-gradient(135deg, #d4af37 0%, #f7e7a0 25%, #d4af37 50%, #b8860b 75%, #d4af37 100%)",
  burgundyMetallic: "linear-gradient(135deg, #722f37 0%, #9a4a54 25%, #722f37 50%, #4e1f24 75%, #722f37 100%)",
};

// Mock verification database
const verifiedCredentials: Record<string, {
  name: string;
  credential: string;
  status: "active" | "expired" | "suspended";
  issueDate: string;
  expiryDate: string;
  specialization: string;
}> = {
  "ASI-2024-FM-001234": {
    name: "Sarah Mitchell",
    credential: "Board Certified Functional Medicine Practitioner (BC-FMP)",
    status: "active",
    issueDate: "March 15, 2024",
    expiryDate: "March 15, 2027",
    specialization: "Functional Medicine",
  },
  "ASI-2023-WH-005678": {
    name: "Jennifer Williams",
    credential: "Certified Professional Women's Health Specialist (WH-CP)",
    status: "active",
    issueDate: "June 22, 2023",
    expiryDate: "June 22, 2026",
    specialization: "Women's Health",
  },
  "ASI-2022-HN-009012": {
    name: "Emily Chen",
    credential: "Certified Health Coach (CHC)",
    status: "expired",
    issueDate: "September 10, 2022",
    expiryDate: "September 10, 2024",
    specialization: "Health Coaching",
  },
};

export default function VerifyPage() {
  const [credentialId, setCredentialId] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<{
    found: boolean;
    data?: typeof verifiedCredentials[string];
  } | null>(null);

  const handleVerify = async () => {
    if (!credentialId.trim()) return;

    setIsSearching(true);
    setSearchResult(null);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    const result = verifiedCredentials[credentialId.toUpperCase()];
    setSearchResult({
      found: !!result,
      data: result,
    });
    setIsSearching(false);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Top Bar */}
      <div style={{ backgroundColor: BRAND.burgundyDark }} className="text-white py-2 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-sm">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2">
              <MapPin className="w-3 h-3" style={{ color: BRAND.gold }} />
              🇺🇸 USA Headquarters
            </span>
            <span className="flex items-center gap-2">
              <MapPin className="w-3 h-3" style={{ color: BRAND.gold }} />
              🇦🇪 Dubai Office
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/directory" className="hover:opacity-80 transition-opacity" style={{ color: BRAND.gold }}>
              Find a Practitioner
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link href="/asi-home" className="flex items-center gap-3">
              <Image
                src="/ASI_LOGO-removebg-preview.png"
                alt="Accreditation Standards Institute"
                width={160}
                height={48}
                className="h-12 w-auto"
              />
            </Link>

            <div className="hidden lg:flex items-center gap-1">
              <Link href="/about" className="px-4 py-2 font-medium hover:opacity-70 transition-opacity" style={{ color: BRAND.burgundy }}>About</Link>
              <Link href="/standards" className="px-4 py-2 font-medium hover:opacity-70 transition-opacity" style={{ color: BRAND.burgundy }}>Standards</Link>
              <Link href="/certifications" className="px-4 py-2 font-medium hover:opacity-70 transition-opacity" style={{ color: BRAND.burgundy }}>Certifications</Link>
              <Link href="/careers" className="px-4 py-2 font-medium hover:opacity-70 transition-opacity" style={{ color: BRAND.burgundy }}>Careers</Link>
              <Link href="/directory" className="px-4 py-2 font-medium hover:opacity-70 transition-opacity" style={{ color: BRAND.burgundy }}>Directory</Link>
              <Link href="/verify" className="px-4 py-2 font-medium hover:opacity-70 transition-opacity" style={{ color: BRAND.burgundy }}>Verify</Link>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost" style={{ color: BRAND.burgundy }}>Log In</Button>
              </Link>
              <Link href="/apply">
                <Button style={{ backgroundColor: BRAND.burgundy, color: "white" }} className="hover:opacity-90">
                  Apply Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-16 md:py-24 text-white overflow-hidden" style={{ backgroundColor: BRAND.burgundyDark }}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, ${BRAND.gold} 1px, transparent 0)`,
            backgroundSize: '48px 48px'
          }} />
        </div>

        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ backgroundColor: `${BRAND.gold}20`, border: `1px solid ${BRAND.gold}40` }}>
            <Shield className="w-4 h-4" style={{ color: BRAND.gold }} />
            <span className="text-sm font-medium" style={{ color: BRAND.gold }}>Official Credential Verification</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Verify an ASI
            <span className="block" style={{ color: BRAND.gold }}>Credential</span>
          </h1>

          <p className="text-xl mb-8" style={{ color: "#f5e6e8" }}>
            Enter a credential ID to verify its authenticity and status.
          </p>

          {/* Verification Form */}
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-xl">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Enter credential ID (e.g., ASI-2024-FM-001234)"
                  value={credentialId}
                  onChange={(e) => setCredentialId(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleVerify()}
                  className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 focus:outline-none focus:border-burgundy-500 text-gray-700"
                />
              </div>
              <Button
                size="lg"
                onClick={handleVerify}
                disabled={isSearching || !credentialId.trim()}
                className="px-8 py-4 h-auto font-bold hover:opacity-90 disabled:opacity-50"
                style={{ backgroundColor: BRAND.burgundy, color: "white" }}
              >
                {isSearching ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify Credential"
                )}
              </Button>
            </div>

            <p className="text-sm text-gray-500 mt-4">
              The credential ID can be found on the practitioner's certificate or digital badge.
            </p>
          </div>
        </div>
      </section>

      {/* Results Section */}
      {searchResult && (
        <section className="py-12 md:py-16" style={{ backgroundColor: BRAND.cream }}>
          <div className="max-w-3xl mx-auto px-4">
            {searchResult.found && searchResult.data ? (
              <div className={`bg-white rounded-2xl shadow-lg border-2 p-8 ${searchResult.data.status === "active" ? "border-green-200" : searchResult.data.status === "expired" ? "border-amber-200" : "border-red-200"}`}>
                <div className="flex items-center gap-4 mb-6">
                  {searchResult.data.status === "active" ? (
                    <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                  ) : searchResult.data.status === "expired" ? (
                    <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center">
                      <AlertCircle className="w-8 h-8 text-amber-600" />
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                      <XCircle className="w-8 h-8 text-red-600" />
                    </div>
                  )}
                  <div>
                    <h2 className={`text-2xl font-bold ${searchResult.data.status === "active" ? "text-green-700" : searchResult.data.status === "expired" ? "text-amber-700" : "text-red-700"}`}>
                      {searchResult.data.status === "active" ? "Verified & Active" : searchResult.data.status === "expired" ? "Credential Expired" : "Credential Suspended"}
                    </h2>
                    <p className="text-gray-600">
                      Credential ID: <span className="font-mono font-bold">{credentialId.toUpperCase()}</span>
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex items-start gap-3">
                    <User className="w-5 h-5 mt-0.5" style={{ color: BRAND.gold }} />
                    <div>
                      <p className="text-sm text-gray-500">Holder Name</p>
                      <p className="font-bold" style={{ color: BRAND.burgundy }}>{searchResult.data.name}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Award className="w-5 h-5 mt-0.5" style={{ color: BRAND.gold }} />
                    <div>
                      <p className="text-sm text-gray-500">Credential</p>
                      <p className="font-bold" style={{ color: BRAND.burgundy }}>{searchResult.data.credential}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 mt-0.5" style={{ color: BRAND.gold }} />
                    <div>
                      <p className="text-sm text-gray-500">Issue Date</p>
                      <p className="font-bold" style={{ color: BRAND.burgundy }}>{searchResult.data.issueDate}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 mt-0.5" style={{ color: BRAND.gold }} />
                    <div>
                      <p className="text-sm text-gray-500">Expiry Date</p>
                      <p className="font-bold" style={{ color: BRAND.burgundy }}>{searchResult.data.expiryDate}</p>
                    </div>
                  </div>
                </div>

                {searchResult.data.status === "active" && (
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <p className="text-sm text-green-600 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      This credential is valid and in good standing with ASI.
                    </p>
                  </div>
                )}

                {searchResult.data.status === "expired" && (
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <p className="text-sm text-amber-600 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      This credential has expired. The holder may be in the process of renewal.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-lg border-2 border-red-200 p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                  <XCircle className="w-8 h-8 text-red-600" />
                </div>
                <h2 className="text-2xl font-bold text-red-700 mb-2">Credential Not Found</h2>
                <p className="text-gray-600 mb-4">
                  The credential ID <span className="font-mono font-bold">{credentialId}</span> was not found in our database.
                </p>
                <p className="text-sm text-gray-500">
                  Please double-check the credential ID and try again. If you believe this is an error, please <Link href="/contact" className="underline" style={{ color: BRAND.burgundy }}>contact us</Link>.
                </p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Demo Credentials */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4" style={{ color: BRAND.burgundy }}>Test Verification</h2>
          <p className="text-gray-600 mb-6">Try these sample credential IDs to see how verification works:</p>
          <div className="flex flex-wrap justify-center gap-4">
            {Object.keys(verifiedCredentials).map(id => (
              <button
                key={id}
                onClick={() => {
                  setCredentialId(id);
                  setSearchResult(null);
                }}
                className="px-4 py-2 rounded-lg font-mono text-sm hover:opacity-80 transition-opacity"
                style={{ backgroundColor: `${BRAND.gold}20`, color: BRAND.burgundy }}
              >
                {id}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Why Verify */}
      <section className="py-12 md:py-16" style={{ backgroundColor: BRAND.cream }}>
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12" style={{ color: BRAND.burgundy }}>
            Why Verify Credentials?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: BRAND.burgundy }}>
                <Shield className="w-8 h-8" style={{ color: BRAND.gold }} />
              </div>
              <h3 className="text-lg font-bold mb-2" style={{ color: BRAND.burgundy }}>Protect Yourself</h3>
              <p className="text-gray-600 text-sm">
                Ensure you're working with a rigorously trained, legitimate practitioner.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: BRAND.burgundy }}>
                <CheckCircle className="w-8 h-8" style={{ color: BRAND.gold }} />
              </div>
              <h3 className="text-lg font-bold mb-2" style={{ color: BRAND.burgundy }}>Confirm Authenticity</h3>
              <p className="text-gray-600 text-sm">
                Verify that credentials haven't been fabricated or misrepresented.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: BRAND.burgundy }}>
                <Award className="w-8 h-8" style={{ color: BRAND.gold }} />
              </div>
              <h3 className="text-lg font-bold mb-2" style={{ color: BRAND.burgundy }}>Check Status</h3>
              <p className="text-gray-600 text-sm">
                Confirm the credential is active, not expired or suspended.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-white py-16" style={{ backgroundColor: BRAND.burgundyDark }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: BRAND.gold }}>
                  <Shield className="w-7 h-7" style={{ color: BRAND.burgundyDark }} />
                </div>
                <div>
                  <div className="font-bold text-lg tracking-tight text-white">ACCREDITATION STANDARDS</div>
                  <div className="text-xs tracking-widest" style={{ color: BRAND.gold }}>INSTITUTE</div>
                </div>
              </div>
              <p className="mb-6 max-w-sm" style={{ color: "#f5e6e8" }}>
                The global authority in functional medicine and health certification.
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-4" style={{ color: BRAND.gold }}>Quick Links</h4>
              <ul className="space-y-2 text-sm" style={{ color: "#f5e6e8" }}>
                <li><Link href="/certifications" className="hover:text-white transition-colors">Certifications</Link></li>
                <li><Link href="/directory" className="hover:text-white transition-colors">Directory</Link></li>
                <li><Link href="/verify" className="hover:text-white transition-colors">Verify</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4" style={{ color: BRAND.gold }}>Company</h4>
              <ul className="space-y-2 text-sm" style={{ color: "#f5e6e8" }}>
                <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4" style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}>
            <p className="text-sm" style={{ color: "#f5e6e8" }}>
              © 2026 Accreditation Standards Institute. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm" style={{ color: "#f5e6e8" }}>
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
