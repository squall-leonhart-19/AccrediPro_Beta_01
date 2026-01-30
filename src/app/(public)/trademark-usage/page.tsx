import Link from "next/link";
import Image from "next/image";
import { Stamp, Mail, Calendar, ArrowLeft, AlertTriangle, CheckCircle, XCircle, Shield, FileText, Palette, Globe, Scale, Hash, AtSign } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// ASI Brand Colors
const BRAND = {
  burgundy: "#722f37",
  burgundyDark: "#4e1f24",
  gold: "#d4af37",
  goldLight: "#e8c547",
  cream: "#fdf8f0",
};

export const metadata = {
  title: "Trademark Usage Guidelines | Accreditation Standards Institute",
  description: "Official guidelines for using Accreditation Standards Institute trademarks, logos, and brand assets. Rules for ASI graduates and partners.",
};

export default function TrademarkUsagePage() {
  const lastUpdated = "January 1, 2025";

  return (
    <div className="min-h-screen bg-white">
      {/* Top Bar */}
      <div style={{ backgroundColor: BRAND.burgundyDark }} className="text-white py-2 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-sm">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2">
              <span>🇺🇸</span> USA Headquarters
            </span>
            <span className="flex items-center gap-2">
              <span>🇦🇪</span> Dubai Office
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/verify" className="hover:opacity-80 transition-opacity" style={{ color: BRAND.gold }}>
              Verify Credential
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/ASI_LOGO-removebg-preview.png"
                alt="Accreditation Standards Institute"
                width={160}
                height={48}
                className="h-12 w-auto"
              />
            </Link>
            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost" style={{ color: BRAND.burgundy }}>Log In</Button>
              </Link>
              <Link href="/certifications">
                <Button style={{ backgroundColor: BRAND.burgundy, color: "white" }} className="hover:opacity-90">
                  View Certifications
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Header */}
      <div className="text-white" style={{ background: `linear-gradient(135deg, ${BRAND.burgundyDark} 0%, ${BRAND.burgundy} 100%)` }}>
        <div className="max-w-6xl mx-auto px-4 py-12">
          <Link href="/" className="inline-flex items-center gap-2 hover:opacity-80 mb-6 transition-opacity" style={{ color: BRAND.gold }}>
            <ArrowLeft className="w-4 h-4" />
            Back to ASI Home
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center border" style={{ backgroundColor: 'rgba(255,255,255,0.1)', borderColor: 'rgba(255,255,255,0.2)' }}>
              <Stamp className="w-6 h-6" style={{ color: BRAND.gold }} />
            </div>
            <span className="px-3 py-1 rounded-full text-sm font-medium" style={{ backgroundColor: `${BRAND.gold}20`, color: BRAND.gold, border: `1px solid ${BRAND.gold}40` }}>
              Brand Guidelines
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Trademark Usage Guidelines</h1>
          <p className="text-lg mb-2" style={{ color: '#f5f5f5' }}>
            Official Rules for Using ASI Brand Assets and Trademarks
          </p>
          <p className="mb-4" style={{ color: BRAND.gold }}>
            Accreditation Standards Institute LLC — A Delaware Limited Liability Company
          </p>
          <div className="flex items-center gap-2 text-sm" style={{ color: '#d1d5db' }}>
            <Calendar className="w-4 h-4" />
            Last Updated: {lastUpdated}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <Card className="border-0 shadow-lg">
          <CardContent className="p-8 md:p-12">

            {/* Section 1: ASI Trademarks */}
            <section className="mb-10 pb-10 border-b border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${BRAND.burgundy}15` }}>
                  <Shield className="w-5 h-5" style={{ color: BRAND.burgundy }} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Article 1: ASI Trademarks and Protected Marks</h2>
              </div>
              <p className="text-gray-700 leading-relaxed mb-4">
                <strong>1.1</strong> The following are registered trademarks and proprietary intellectual property of Accreditation Standards Institute LLC ("ASI"):
              </p>
              <div className="rounded-xl p-6 border mb-4" style={{ backgroundColor: BRAND.cream, borderColor: `${BRAND.gold}30` }}>
                <ul className="space-y-2 text-gray-800">
                  <li className="flex items-start gap-3">
                    <Shield className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: BRAND.burgundy }} />
                    <span><strong>Accreditation Standards Institute®</strong> — Full institutional name</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Shield className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: BRAND.burgundy }} />
                    <span><strong>ASI®</strong> — Abbreviated name and acronym</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Shield className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: BRAND.burgundy }} />
                    <span><strong>The ASI Logo and Visual Identity</strong> — Including all logo variations, seals, and badges</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Shield className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: BRAND.burgundy }} />
                    <span><strong>Certification Program Names</strong> — Including "Certified Functional Medicine Health Coach™," "Certified Holistic Nutrition Coach™," and all program-specific titles</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Shield className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: BRAND.burgundy }} />
                    <span><strong>Credential Designations</strong> — Including CFMHC, CHNC, CWHS, CIWP, CMHC, and all certificate abbreviations</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Shield className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: BRAND.burgundy }} />
                    <span><strong>Course Titles and Curriculum Content</strong> — All educational materials, lesson content, and proprietary methodologies</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Shield className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: BRAND.burgundy }} />
                    <span><strong>Certificate Designs</strong> — All certificate templates, digital badges, and verification seals</span>
                  </li>
                </ul>
              </div>
              <p className="text-gray-700 leading-relaxed">
                <strong>1.2</strong> These marks are protected under United States and international trademark law. Unauthorized use may result in legal action, including claims for trademark infringement, unfair competition, and monetary damages.
              </p>
            </section>

            {/* Section 2: Permitted Uses for Certified Graduates */}
            <section className="mb-10 pb-10 border-b border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#dcfce7' }}>
                  <CheckCircle className="w-5 h-5" style={{ color: '#16a34a' }} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Article 2: Permitted Uses (Certified Graduates)</h2>
              </div>
              <p className="text-gray-700 leading-relaxed mb-4">
                <strong>2.1</strong> If you are a certified ASI graduate in good standing, you are granted a limited, non-exclusive, revocable license to use ASI trademarks as follows:
              </p>
              <div className="rounded-xl p-6 border mb-6" style={{ backgroundColor: '#f0fdf4', borderColor: '#22c55e' }}>
                <h4 className="font-bold mb-3" style={{ color: '#15803d' }}>Authorized Uses:</h4>
                <ul className="space-y-2 text-gray-800">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#16a34a' }} />
                    <span>State that you are <strong>"Certified by the Accreditation Standards Institute"</strong> or <strong>"ASI Certified"</strong></span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#16a34a' }} />
                    <span>Display your <strong>official ASI digital certificate</strong> on your website, social media, and professional profiles</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#16a34a' }} />
                    <span>Use your <strong>certification title and credential designation</strong> (e.g., "Certified Functional Medicine Health Coach" or "CFMHC")</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#16a34a' }} />
                    <span>Include statements such as <strong>"Graduate of Accreditation Standards Institute"</strong> in professional biographies</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#16a34a' }} />
                    <span>Link to the official ASI website <strong>(accreditation-standards.org)</strong></span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#16a34a' }} />
                    <span>Share your certification achievement on <strong>social media platforms</strong> with appropriate attribution</span>
                  </li>
                </ul>
              </div>

              <h3 className="text-lg font-semibold text-gray-800 mb-3">2.2 Proper Attribution Examples:</h3>
              <div className="rounded-xl p-4 border mb-4" style={{ backgroundColor: '#f9fafb', borderColor: '#e5e7eb' }}>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span style={{ color: '#16a34a' }}>✓</span>
                    <span>"Jane Smith, Certified Functional Medicine Health Coach (ASI)"</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span style={{ color: '#16a34a' }}>✓</span>
                    <span>"John Doe, CFMHC — Accreditation Standards Institute"</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span style={{ color: '#16a34a' }}>✓</span>
                    <span>"Certified by the Accreditation Standards Institute | accreditation-standards.org"</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span style={{ color: '#16a34a' }}>✓</span>
                    <span>"Sarah Johnson — ASI Certified Holistic Nutrition Coach"</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span style={{ color: '#16a34a' }}>✓</span>
                    <span>"Holding certification in Women's Health from Accreditation Standards Institute"</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Section 3: Prohibited Uses */}
            <section className="mb-10 pb-10 border-b border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#fef2f2' }}>
                  <XCircle className="w-5 h-5" style={{ color: '#dc2626' }} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Article 3: Prohibited Uses</h2>
              </div>
              <p className="text-gray-700 leading-relaxed mb-4">
                <strong>3.1</strong> The following uses of ASI trademarks are strictly prohibited. Violations may result in immediate credential revocation and legal action:
              </p>
              <div className="rounded-xl p-6 border mb-6" style={{ backgroundColor: '#fef2f2', borderColor: '#ef4444' }}>
                <ul className="space-y-3 text-gray-800">
                  <li className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#dc2626' }} />
                    <span><strong>Using "ASI" or "Accreditation Standards Institute" in your business name</strong> (e.g., "ASI Wellness Center" or "Accreditation Standards Coaching")</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#dc2626' }} />
                    <span><strong>Registering domain names containing ASI trademarks</strong> (e.g., asi-coaching.com, accreditationstandardscoach.com)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#dc2626' }} />
                    <span><strong>Creating logos, graphics, or visual assets that incorporate ASI trademarks</strong> without prior written authorization</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#dc2626' }} />
                    <span><strong>Implying partnership, sponsorship, endorsement, or official affiliation</strong> with ASI beyond being a certified graduate</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#dc2626' }} />
                    <span><strong>Modifying, altering, distorting, or redesigning</strong> the ASI logo or any official brand assets</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#dc2626' }} />
                    <span><strong>Using ASI trademarks in paid advertising</strong> (Google Ads, Facebook Ads, etc.) without prior written approval</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#dc2626' }} />
                    <span><strong>Selling products or services using ASI branding</strong> as if they were official ASI offerings</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#dc2626' }} />
                    <span><strong>Creating social media handles that could be confused</strong> with official ASI accounts (e.g., @ASICoaching, @AccreditationStandardsInstitute)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#dc2626' }} />
                    <span><strong>Speaking on behalf of ASI</strong> or making statements as an official representative without authorization</span>
                  </li>
                </ul>
              </div>

              <h3 className="text-lg font-semibold text-gray-800 mb-3">3.2 Improper Use Examples:</h3>
              <div className="rounded-xl p-4 border" style={{ backgroundColor: '#fef2f2', borderColor: '#fecaca' }}>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span style={{ color: '#dc2626' }}>✗</span>
                    <span>"ASI Wellness Center" — Using ASI in business name</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span style={{ color: '#dc2626' }}>✗</span>
                    <span>"accreditation-standards-coach.com" — Trademark in domain name</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span style={{ color: '#dc2626' }}>✗</span>
                    <span>"@ASIJaneSmith" — Confusing social media handle</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span style={{ color: '#dc2626' }}>✗</span>
                    <span>Using the ASI logo on business cards without permission</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span style={{ color: '#dc2626' }}>✗</span>
                    <span>"Official ASI Partner" — Implying partnership without authorization</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Section 4: Logo Usage */}
            <section className="mb-10 pb-10 border-b border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${BRAND.burgundy}15` }}>
                  <Palette className="w-5 h-5" style={{ color: BRAND.burgundy }} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Article 4: Logo Usage Policy</h2>
              </div>
              <p className="text-gray-700 leading-relaxed mb-4">
                <strong>4.1</strong> The ASI logo is a protected trademark and may only be used under the following conditions:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li><strong>By certified graduates</strong> displaying their official digital certificate (logo is embedded in certificate)</li>
                <li><strong>With prior written permission</strong> from ASI for specific, approved use cases</li>
                <li><strong>In accordance with ASI brand guidelines</strong> provided upon approval</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mb-4">
                <strong>4.2</strong> If permission is granted, the following logo usage rules apply:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li>The logo must not be modified, stretched, recolored, or altered in any way</li>
                <li>Minimum clear space must be maintained around the logo</li>
                <li>The logo must not be placed on busy backgrounds that reduce legibility</li>
                <li>The logo must link to the official ASI website when used digitally</li>
                <li>The logo must never appear larger than your own business branding</li>
              </ul>
              <div className="rounded-xl p-4 border" style={{ backgroundColor: BRAND.cream, borderColor: `${BRAND.gold}30` }}>
                <p className="text-sm text-gray-700">
                  <strong>To request logo usage permission:</strong> Email{" "}
                  <a href="mailto:brand@accreditation-standards.org" className="hover:underline font-medium" style={{ color: BRAND.burgundy }}>
                    brand@accreditation-standards.org
                  </a>
                  {" "}with your name, certification status, and detailed description of intended use.
                </p>
              </div>
            </section>

            {/* Section 5: Social Media Guidelines */}
            <section className="mb-10 pb-10 border-b border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${BRAND.burgundy}15` }}>
                  <Hash className="w-5 h-5" style={{ color: BRAND.burgundy }} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Article 5: Social Media Guidelines</h2>
              </div>
              <p className="text-gray-700 leading-relaxed mb-4">
                <strong>5.1</strong> When posting about your ASI certification on social media, you must:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li>Be honest and accurate about your certification and qualifications</li>
                <li>Clearly distinguish your personal opinions from official ASI positions</li>
                <li>Not create accounts that could be confused with official ASI accounts</li>
                <li>Not speak on behalf of ASI without explicit authorization</li>
                <li>Tag official ASI accounts appropriately when referencing your certification</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mb-4">
                <strong>5.2</strong> Recommended hashtags for sharing your certification:
              </p>
              <div className="rounded-xl p-4 border" style={{ backgroundColor: '#f9fafb', borderColor: '#e5e7eb' }}>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 rounded-full text-sm font-medium" style={{ backgroundColor: `${BRAND.burgundy}15`, color: BRAND.burgundy }}>#ASICertified</span>
                  <span className="px-3 py-1 rounded-full text-sm font-medium" style={{ backgroundColor: `${BRAND.burgundy}15`, color: BRAND.burgundy }}>#AccreditationStandardsInstitute</span>
                  <span className="px-3 py-1 rounded-full text-sm font-medium" style={{ backgroundColor: `${BRAND.burgundy}15`, color: BRAND.burgundy }}>#ASIGraduate</span>
                  <span className="px-3 py-1 rounded-full text-sm font-medium" style={{ backgroundColor: `${BRAND.burgundy}15`, color: BRAND.burgundy }}>#CertifiedHealthCoach</span>
                  <span className="px-3 py-1 rounded-full text-sm font-medium" style={{ backgroundColor: `${BRAND.burgundy}15`, color: BRAND.burgundy }}>#FunctionalMedicine</span>
                </div>
              </div>
            </section>

            {/* Section 6: Third-Party Use */}
            <section className="mb-10 pb-10 border-b border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${BRAND.burgundy}15` }}>
                  <Globe className="w-5 h-5" style={{ color: BRAND.burgundy }} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Article 6: Third-Party and Media Use</h2>
              </div>
              <p className="text-gray-700 leading-relaxed mb-4">
                <strong>6.1</strong> Media outlets, journalists, bloggers, and other third parties wishing to reference or use ASI trademarks must:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li>Use the full, correct name: "Accreditation Standards Institute" (not abbreviated on first reference)</li>
                <li>Include appropriate trademark symbols (® or ™) on first use when practical</li>
                <li>Contact ASI for official logo assets, press materials, or interview requests</li>
                <li>Not imply endorsement or partnership without written authorization</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                <strong>6.2</strong> For media inquiries and press materials, contact:{" "}
                <a href="mailto:press@accreditation-standards.org" className="hover:underline font-medium" style={{ color: BRAND.burgundy }}>
                  press@accreditation-standards.org
                </a>
              </p>
            </section>

            {/* Section 7: Enforcement */}
            <section className="mb-10 pb-10 border-b border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#fef2f2' }}>
                  <AlertTriangle className="w-5 h-5" style={{ color: '#dc2626' }} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Article 7: Enforcement and Consequences</h2>
              </div>
              <p className="text-gray-700 leading-relaxed mb-4">
                <strong>7.1</strong> ASI actively monitors and protects its trademarks. Violations of these guidelines may result in:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li>Formal cease and desist notice demanding immediate correction</li>
                <li>Immediate revocation of ASI certification and credential rights</li>
                <li>Removal from the ASI graduate directory and verification system</li>
                <li>Legal action for trademark infringement under the Lanham Act (15 U.S.C. § 1051 et seq.)</li>
                <li>Claims for monetary damages, including actual damages, profits, and statutory damages up to $2,000,000 per willful infringement</li>
                <li>Recovery of attorney's fees and litigation costs</li>
                <li>Injunctive relief requiring immediate cessation of infringing activities</li>
              </ul>
              <div className="rounded-xl p-4 border" style={{ backgroundColor: '#fef2f2', borderColor: '#ef4444' }}>
                <p className="text-sm leading-relaxed font-medium" style={{ color: '#991b1b' }}>
                  <strong>Warning:</strong> Trademark infringement is a serious legal matter. ASI will vigorously defend its intellectual property rights and pursue all available legal remedies against unauthorized use.
                </p>
              </div>
            </section>

            {/* Section 8: Reporting Violations */}
            <section className="mb-10 pb-10 border-b border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${BRAND.burgundy}15` }}>
                  <FileText className="w-5 h-5" style={{ color: BRAND.burgundy }} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Article 8: Reporting Trademark Violations</h2>
              </div>
              <p className="text-gray-700 leading-relaxed mb-4">
                <strong>8.1</strong> ASI appreciates the assistance of our graduate community in protecting our shared brand. If you become aware of unauthorized use of ASI trademarks, please report it immediately.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                <strong>8.2</strong> When reporting a violation, please include:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li>Description of the unauthorized use</li>
                <li>URL, screenshots, or other evidence</li>
                <li>Name/contact information of the infringing party (if known)</li>
                <li>Your contact information for follow-up</li>
              </ul>
              <div className="rounded-xl p-4 border" style={{ backgroundColor: BRAND.cream, borderColor: `${BRAND.gold}30` }}>
                <p className="text-sm text-gray-700">
                  <strong>Report violations to:</strong>{" "}
                  <a href="mailto:legal@accreditation-standards.org" className="hover:underline font-medium" style={{ color: BRAND.burgundy }}>
                    legal@accreditation-standards.org
                  </a>
                </p>
              </div>
            </section>

            {/* Contact Section */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${BRAND.burgundy}15` }}>
                  <Mail className="w-5 h-5" style={{ color: BRAND.burgundy }} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Article 9: Contact Information</h2>
              </div>
              <div className="rounded-xl p-6 border" style={{ backgroundColor: BRAND.cream, borderColor: `${BRAND.gold}30` }}>
                <p className="font-bold text-gray-900 mb-3">Accreditation Standards Institute LLC</p>
                <div className="space-y-2 text-gray-700">
                  <p>
                    <strong>Trademark & Brand Inquiries:</strong>{" "}
                    <a href="mailto:brand@accreditation-standards.org" className="hover:underline font-medium" style={{ color: BRAND.burgundy }}>
                      brand@accreditation-standards.org
                    </a>
                  </p>
                  <p>
                    <strong>Logo Usage Permission:</strong>{" "}
                    <a href="mailto:brand@accreditation-standards.org" className="hover:underline font-medium" style={{ color: BRAND.burgundy }}>
                      brand@accreditation-standards.org
                    </a>
                  </p>
                  <p>
                    <strong>Legal & Enforcement:</strong>{" "}
                    <a href="mailto:legal@accreditation-standards.org" className="hover:underline font-medium" style={{ color: BRAND.burgundy }}>
                      legal@accreditation-standards.org
                    </a>
                  </p>
                  <p>
                    <strong>Media & Press:</strong>{" "}
                    <a href="mailto:press@accreditation-standards.org" className="hover:underline font-medium" style={{ color: BRAND.burgundy }}>
                      press@accreditation-standards.org
                    </a>
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t" style={{ borderColor: `${BRAND.gold}30` }}>
                  <p className="text-sm text-gray-600">
                    <strong>Legal Entity:</strong> Accreditation Standards Institute LLC, a Delaware Limited Liability Company
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Offices:</strong> United States (Headquarters) • Dubai, UAE (International Office)
                  </p>
                </div>
              </div>
            </section>

          </CardContent>
        </Card>

        {/* Related Legal Documents */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-900 text-center mb-4">Related Legal Documents</h3>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/credential-terms">
              <Button variant="outline" className="border-gray-200 hover:border-gray-300" style={{ color: BRAND.burgundy }}>
                Credential Terms
              </Button>
            </Link>
            <Link href="/code-of-ethics">
              <Button variant="outline" className="border-gray-200 hover:border-gray-300" style={{ color: BRAND.burgundy }}>
                Code of Ethics
              </Button>
            </Link>
            <Link href="/terms-of-service">
              <Button variant="outline" className="border-gray-200 hover:border-gray-300" style={{ color: BRAND.burgundy }}>
                Terms of Service
              </Button>
            </Link>
            <Link href="/privacy-policy">
              <Button variant="outline" className="border-gray-200 hover:border-gray-300" style={{ color: BRAND.burgundy }}>
                Privacy Policy
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <Image
                src="/ASI_LOGO-removebg-preview.png"
                alt="ASI"
                width={100}
                height={30}
                className="h-8 w-auto"
              />
              <span className="text-sm text-gray-600">
                © {new Date().getFullYear()} Accreditation Standards Institute LLC. All rights reserved.
              </span>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <Link href="/terms-of-service" className="hover:underline" style={{ color: BRAND.burgundy }}>
                Terms
              </Link>
              <Link href="/privacy-policy" className="hover:underline" style={{ color: BRAND.burgundy }}>
                Privacy
              </Link>
              <Link href="/contact" className="hover:underline" style={{ color: BRAND.burgundy }}>
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
