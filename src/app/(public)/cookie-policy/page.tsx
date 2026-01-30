import Link from "next/link";
import Image from "next/image";
import { Cookie, Mail, Calendar, ArrowLeft, Shield, Settings, BarChart3, Target, Users, Globe, ToggleLeft, Info } from "lucide-react";
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
  title: "Cookie Policy | Accreditation Standards Institute",
  description: "Learn how Accreditation Standards Institute uses cookies and similar tracking technologies on our website and learning platform.",
};

export default function CookiePolicyPage() {
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
              <Cookie className="w-6 h-6" style={{ color: BRAND.gold }} />
            </div>
            <span className="px-3 py-1 rounded-full text-sm font-medium" style={{ backgroundColor: `${BRAND.gold}20`, color: BRAND.gold, border: `1px solid ${BRAND.gold}40` }}>
              Privacy & Cookies
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Cookie Policy</h1>
          <p className="text-lg mb-2" style={{ color: '#f5f5f5' }}>
            How We Use Cookies and Similar Technologies
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

            {/* Section 1: What Are Cookies */}
            <section className="mb-10 pb-10 border-b border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${BRAND.burgundy}15` }}>
                  <Info className="w-5 h-5" style={{ color: BRAND.burgundy }} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">1. What Are Cookies?</h2>
              </div>
              <p className="text-gray-700 leading-relaxed mb-4">
                Cookies are small text files that are placed on your computer, smartphone, or other device when you visit a website. They are widely used to make websites work more efficiently, provide a better user experience, and give website owners information about how their site is being used.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                Similar technologies include:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li><strong>Web beacons (pixel tags)</strong> — Small graphic images embedded in web pages or emails</li>
                <li><strong>Local storage</strong> — Data stored in your browser that persists across sessions</li>
                <li><strong>Session storage</strong> — Data stored temporarily during your browsing session</li>
                <li><strong>Device fingerprinting</strong> — Collecting information about your device configuration</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                This Cookie Policy explains how Accreditation Standards Institute LLC ("ASI," "we," "us," or "our") uses these technologies on our website (accreditation-standards.org) and learning management system.
              </p>
            </section>

            {/* Section 2: Types of Cookies We Use */}
            <section className="mb-10 pb-10 border-b border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${BRAND.burgundy}15` }}>
                  <Cookie className="w-5 h-5" style={{ color: BRAND.burgundy }} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">2. Types of Cookies We Use</h2>
              </div>

              {/* Essential Cookies */}
              <div className="rounded-xl p-6 border mb-6" style={{ backgroundColor: '#f0fdf4', borderColor: '#22c55e' }}>
                <div className="flex items-center gap-3 mb-3">
                  <Shield className="w-6 h-6" style={{ color: '#16a34a' }} />
                  <h3 className="text-lg font-bold" style={{ color: '#15803d' }}>Essential Cookies (Strictly Necessary)</h3>
                </div>
                <p className="text-gray-700 mb-3">
                  These cookies are necessary for the website to function and cannot be switched off. They are usually only set in response to actions made by you, such as logging in or filling in forms.
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                  <li>Authentication and session management</li>
                  <li>Security features and fraud prevention</li>
                  <li>Load balancing and site performance</li>
                  <li>User preferences (language, timezone)</li>
                  <li>Shopping cart and checkout functionality</li>
                </ul>
              </div>

              {/* Functional Cookies */}
              <div className="rounded-xl p-6 border mb-6" style={{ backgroundColor: '#eff6ff', borderColor: '#3b82f6' }}>
                <div className="flex items-center gap-3 mb-3">
                  <Settings className="w-6 h-6" style={{ color: '#2563eb' }} />
                  <h3 className="text-lg font-bold" style={{ color: '#1e40af' }}>Functional Cookies</h3>
                </div>
                <p className="text-gray-700 mb-3">
                  These cookies enable enhanced functionality and personalization. They may be set by us or by third-party providers whose services we have added to our pages.
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                  <li>Remembering your login details</li>
                  <li>Storing your course progress and bookmarks</li>
                  <li>Video player preferences</li>
                  <li>Chat and messaging features</li>
                  <li>Personalized content recommendations</li>
                </ul>
              </div>

              {/* Analytics Cookies */}
              <div className="rounded-xl p-6 border mb-6" style={{ backgroundColor: '#fef3c7', borderColor: '#f59e0b' }}>
                <div className="flex items-center gap-3 mb-3">
                  <BarChart3 className="w-6 h-6" style={{ color: '#d97706' }} />
                  <h3 className="text-lg font-bold" style={{ color: '#92400e' }}>Analytics Cookies</h3>
                </div>
                <p className="text-gray-700 mb-3">
                  These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                  <li>Page views and navigation patterns</li>
                  <li>Time spent on pages and courses</li>
                  <li>Error tracking and troubleshooting</li>
                  <li>Feature usage and engagement metrics</li>
                  <li>Geographic and demographic insights (aggregated)</li>
                </ul>
              </div>

              {/* Marketing Cookies */}
              <div className="rounded-xl p-6 border" style={{ backgroundColor: '#fdf2f8', borderColor: '#ec4899' }}>
                <div className="flex items-center gap-3 mb-3">
                  <Target className="w-6 h-6" style={{ color: '#db2777' }} />
                  <h3 className="text-lg font-bold" style={{ color: '#9d174d' }}>Marketing Cookies</h3>
                </div>
                <p className="text-gray-700 mb-3">
                  These cookies may be set through our site by advertising partners. They may be used to build a profile of your interests and show you relevant ads on other sites.
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                  <li>Remarketing and retargeting campaigns</li>
                  <li>Conversion tracking</li>
                  <li>Social media sharing features</li>
                  <li>Interest-based advertising</li>
                  <li>Campaign performance measurement</li>
                </ul>
              </div>
            </section>

            {/* Section 3: Specific Cookies We Use */}
            <section className="mb-10 pb-10 border-b border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${BRAND.burgundy}15` }}>
                  <Users className="w-5 h-5" style={{ color: BRAND.burgundy }} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">3. Specific Cookies and Third-Party Services</h2>
              </div>
              <p className="text-gray-700 leading-relaxed mb-4">
                We use the following third-party services that may place cookies on your device:
              </p>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-200 text-sm">
                  <thead>
                    <tr style={{ backgroundColor: BRAND.cream }}>
                      <th className="border border-gray-200 px-4 py-3 text-left font-semibold" style={{ color: BRAND.burgundy }}>Service</th>
                      <th className="border border-gray-200 px-4 py-3 text-left font-semibold" style={{ color: BRAND.burgundy }}>Purpose</th>
                      <th className="border border-gray-200 px-4 py-3 text-left font-semibold" style={{ color: BRAND.burgundy }}>Type</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-700">
                    <tr>
                      <td className="border border-gray-200 px-4 py-3">Google Analytics</td>
                      <td className="border border-gray-200 px-4 py-3">Website analytics and user behavior tracking</td>
                      <td className="border border-gray-200 px-4 py-3">Analytics</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-200 px-4 py-3">Stripe</td>
                      <td className="border border-gray-200 px-4 py-3">Payment processing and fraud prevention</td>
                      <td className="border border-gray-200 px-4 py-3">Essential</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-200 px-4 py-3">Meta (Facebook) Pixel</td>
                      <td className="border border-gray-200 px-4 py-3">Advertising measurement and optimization</td>
                      <td className="border border-gray-200 px-4 py-3">Marketing</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-200 px-4 py-3">Google Ads</td>
                      <td className="border border-gray-200 px-4 py-3">Advertising and conversion tracking</td>
                      <td className="border border-gray-200 px-4 py-3">Marketing</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-200 px-4 py-3">Hotjar</td>
                      <td className="border border-gray-200 px-4 py-3">User experience analysis and heatmaps</td>
                      <td className="border border-gray-200 px-4 py-3">Analytics</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-200 px-4 py-3">Sentry</td>
                      <td className="border border-gray-200 px-4 py-3">Error tracking and performance monitoring</td>
                      <td className="border border-gray-200 px-4 py-3">Functional</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-200 px-4 py-3">Intercom/Chat</td>
                      <td className="border border-gray-200 px-4 py-3">Customer support and messaging</td>
                      <td className="border border-gray-200 px-4 py-3">Functional</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-200 px-4 py-3">YouTube/Vimeo</td>
                      <td className="border border-gray-200 px-4 py-3">Video content delivery</td>
                      <td className="border border-gray-200 px-4 py-3">Functional</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Section 4: Managing Cookies */}
            <section className="mb-10 pb-10 border-b border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${BRAND.burgundy}15` }}>
                  <ToggleLeft className="w-5 h-5" style={{ color: BRAND.burgundy }} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">4. Managing Your Cookie Preferences</h2>
              </div>
              <p className="text-gray-700 leading-relaxed mb-4">
                <strong>4.1 Cookie Consent Banner:</strong> When you first visit our website, you will see a cookie consent banner that allows you to accept or customize your cookie preferences. You can change these preferences at any time.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                <strong>4.2 Browser Settings:</strong> Most web browsers allow you to control cookies through their settings. You can typically:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li>View what cookies are stored on your device</li>
                <li>Delete some or all cookies</li>
                <li>Block all cookies or only third-party cookies</li>
                <li>Set preferences for specific websites</li>
              </ul>

              <div className="rounded-xl p-6 border mb-4" style={{ backgroundColor: BRAND.cream, borderColor: `${BRAND.gold}30` }}>
                <h4 className="font-bold mb-3" style={{ color: BRAND.burgundy }}>Browser Cookie Settings:</h4>
                <ul className="space-y-2 text-gray-700">
                  <li><strong>Chrome:</strong> Settings → Privacy and Security → Cookies and other site data</li>
                  <li><strong>Firefox:</strong> Settings → Privacy & Security → Cookies and Site Data</li>
                  <li><strong>Safari:</strong> Preferences → Privacy → Manage Website Data</li>
                  <li><strong>Edge:</strong> Settings → Cookies and site permissions → Manage and delete cookies</li>
                </ul>
              </div>

              <p className="text-gray-700 leading-relaxed mb-4">
                <strong>4.3 Opt-Out Links:</strong> You can opt out of specific tracking services:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li><strong>Google Analytics:</strong> Install the Google Analytics Opt-out Browser Add-on</li>
                <li><strong>Facebook:</strong> Adjust your Ad Preferences in your Facebook settings</li>
                <li><strong>General advertising:</strong> Visit the Digital Advertising Alliance opt-out page (optout.aboutads.info)</li>
              </ul>
            </section>

            {/* Section 5: Impact of Disabling Cookies */}
            <section className="mb-10 pb-10 border-b border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#fef2f2' }}>
                  <Shield className="w-5 h-5" style={{ color: '#dc2626' }} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">5. Impact of Disabling Cookies</h2>
              </div>
              <p className="text-gray-700 leading-relaxed mb-4">
                Please note that blocking or deleting cookies may affect your experience on our website:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li><strong>Essential cookies:</strong> Disabling these may prevent you from logging in or completing purchases</li>
                <li><strong>Functional cookies:</strong> Your preferences and progress may not be saved</li>
                <li><strong>Analytics cookies:</strong> We won't be able to improve your experience based on usage data</li>
                <li><strong>Marketing cookies:</strong> You may still see ads, but they won't be personalized to your interests</li>
              </ul>
              <div className="rounded-xl p-4 border" style={{ backgroundColor: '#fffbeb', borderColor: '#f59e0b' }}>
                <p className="text-sm leading-relaxed" style={{ color: '#92400e' }}>
                  <strong>Note:</strong> Some features of our learning platform require cookies to function properly. If you disable essential cookies, you may not be able to access course content or track your certification progress.
                </p>
              </div>
            </section>

            {/* Section 6: Do Not Track */}
            <section className="mb-10 pb-10 border-b border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${BRAND.burgundy}15` }}>
                  <Globe className="w-5 h-5" style={{ color: BRAND.burgundy }} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">6. Do Not Track Signals</h2>
              </div>
              <p className="text-gray-700 leading-relaxed mb-4">
                Some browsers include a "Do Not Track" (DNT) feature that signals to websites you visit that you do not want your online activity tracked. Because there is no uniform standard for how DNT signals should be interpreted, our website does not currently respond to DNT browser signals.
              </p>
              <p className="text-gray-700 leading-relaxed">
                However, you can use the cookie management options described above to control tracking on our site.
              </p>
            </section>

            {/* Section 7: Updates to This Policy */}
            <section className="mb-10 pb-10 border-b border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${BRAND.burgundy}15` }}>
                  <Calendar className="w-5 h-5" style={{ color: BRAND.burgundy }} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">7. Updates to This Cookie Policy</h2>
              </div>
              <p className="text-gray-700 leading-relaxed mb-4">
                We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will post the updated policy on this page with a new "Last Updated" date.
              </p>
              <p className="text-gray-700 leading-relaxed">
                We encourage you to review this Cookie Policy periodically to stay informed about how we use cookies.
              </p>
            </section>

            {/* Contact Section */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${BRAND.burgundy}15` }}>
                  <Mail className="w-5 h-5" style={{ color: BRAND.burgundy }} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">8. Contact Us</h2>
              </div>
              <p className="text-gray-700 leading-relaxed mb-4">
                If you have questions about our use of cookies or this Cookie Policy, please contact us:
              </p>
              <div className="rounded-xl p-6 border" style={{ backgroundColor: BRAND.cream, borderColor: `${BRAND.gold}30` }}>
                <p className="font-bold text-gray-900 mb-3">Accreditation Standards Institute LLC</p>
                <div className="space-y-2 text-gray-700">
                  <p>
                    <strong>Privacy Inquiries:</strong>{" "}
                    <a href="mailto:privacy@accreditation-standards.org" className="hover:underline font-medium" style={{ color: BRAND.burgundy }}>
                      privacy@accreditation-standards.org
                    </a>
                  </p>
                  <p>
                    <strong>General Support:</strong>{" "}
                    <a href="mailto:legal@accredipro.academy" className="hover:underline font-medium" style={{ color: BRAND.burgundy }}>
                      legal@accredipro.academy
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
            <Link href="/privacy-policy">
              <Button variant="outline" className="border-gray-200 hover:border-gray-300" style={{ color: BRAND.burgundy }}>
                Privacy Policy
              </Button>
            </Link>
            <Link href="/terms-of-service">
              <Button variant="outline" className="border-gray-200 hover:border-gray-300" style={{ color: BRAND.burgundy }}>
                Terms of Service
              </Button>
            </Link>
            <Link href="/accessibility">
              <Button variant="outline" className="border-gray-200 hover:border-gray-300" style={{ color: BRAND.burgundy }}>
                Accessibility
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
