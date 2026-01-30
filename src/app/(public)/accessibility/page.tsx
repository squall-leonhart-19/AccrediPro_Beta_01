import Link from "next/link";
import Image from "next/image";
import { Accessibility, Mail, Calendar, ArrowLeft, Eye, Ear, Hand, Brain, Monitor, Keyboard, MessageSquare, CheckCircle, Heart } from "lucide-react";
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
  title: "Accessibility Statement | Accreditation Standards Institute",
  description: "ASI is committed to ensuring digital accessibility for people with disabilities. Learn about our accessibility features and how to request accommodations.",
};

export default function AccessibilityPage() {
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
              <Accessibility className="w-6 h-6" style={{ color: BRAND.gold }} />
            </div>
            <span className="px-3 py-1 rounded-full text-sm font-medium" style={{ backgroundColor: `${BRAND.gold}20`, color: BRAND.gold, border: `1px solid ${BRAND.gold}40` }}>
              Inclusive Design
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Accessibility Statement</h1>
          <p className="text-lg mb-2" style={{ color: '#f5f5f5' }}>
            Our Commitment to Digital Accessibility for All
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

            {/* Section 1: Our Commitment */}
            <section className="mb-10 pb-10 border-b border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${BRAND.burgundy}15` }}>
                  <Heart className="w-5 h-5" style={{ color: BRAND.burgundy }} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">1. Our Commitment to Accessibility</h2>
              </div>
              <p className="text-gray-700 leading-relaxed mb-4">
                Accreditation Standards Institute LLC ("ASI") is committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone and applying the relevant accessibility standards to ensure we provide equal access to all users.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                We believe that education should be accessible to everyone, regardless of ability. Our mission to empower health and wellness professionals includes ensuring that our learning platform and resources are usable by the widest possible audience.
              </p>
              <div className="rounded-xl p-6 border" style={{ backgroundColor: BRAND.cream, borderColor: `${BRAND.gold}30` }}>
                <p className="text-gray-700 leading-relaxed italic">
                  "True education is inclusive. We are dedicated to removing barriers that prevent individuals with disabilities from accessing our certification programs and advancing their careers in health and wellness."
                </p>
                <p className="text-sm mt-2 font-medium" style={{ color: BRAND.burgundy }}>— ASI Leadership Team</p>
              </div>
            </section>

            {/* Section 2: Conformance Status */}
            <section className="mb-10 pb-10 border-b border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${BRAND.burgundy}15` }}>
                  <CheckCircle className="w-5 h-5" style={{ color: BRAND.burgundy }} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">2. Conformance Status</h2>
              </div>
              <p className="text-gray-700 leading-relaxed mb-4">
                The Web Content Accessibility Guidelines (WCAG) defines requirements for designers and developers to improve accessibility for people with disabilities. It defines three levels of conformance: Level A, Level AA, and Level AAA.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                <strong>ASI's Goal:</strong> We strive to conform to WCAG 2.1 Level AA standards. This is an ongoing effort, and we are actively working to meet and exceed these guidelines across our entire platform.
              </p>
              <div className="rounded-xl p-6 border" style={{ backgroundColor: '#f0fdf4', borderColor: '#22c55e' }}>
                <h4 className="font-bold mb-3" style={{ color: '#15803d' }}>Current Accessibility Measures:</h4>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#16a34a' }} />
                    <span>Regular accessibility audits of our website and learning platform</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#16a34a' }} />
                    <span>Accessibility training for our development and content teams</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#16a34a' }} />
                    <span>Integration of accessibility into our development process</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#16a34a' }} />
                    <span>User feedback collection and remediation process</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Section 3: Accessibility Features */}
            <section className="mb-10 pb-10 border-b border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${BRAND.burgundy}15` }}>
                  <Monitor className="w-5 h-5" style={{ color: BRAND.burgundy }} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">3. Accessibility Features</h2>
              </div>
              <p className="text-gray-700 leading-relaxed mb-6">
                Our website and learning platform include the following accessibility features:
              </p>

              {/* Visual Accessibility */}
              <div className="rounded-xl p-6 border mb-4" style={{ backgroundColor: '#eff6ff', borderColor: '#3b82f6' }}>
                <div className="flex items-center gap-3 mb-3">
                  <Eye className="w-6 h-6" style={{ color: '#2563eb' }} />
                  <h3 className="text-lg font-bold" style={{ color: '#1e40af' }}>Visual Accessibility</h3>
                </div>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>High contrast color schemes with sufficient color contrast ratios</li>
                  <li>Resizable text that can be enlarged up to 200% without loss of functionality</li>
                  <li>Alt text for all meaningful images and graphics</li>
                  <li>Clear visual focus indicators for interactive elements</li>
                  <li>Consistent navigation and layout throughout the site</li>
                  <li>No content that flashes more than three times per second</li>
                </ul>
              </div>

              {/* Auditory Accessibility */}
              <div className="rounded-xl p-6 border mb-4" style={{ backgroundColor: '#fef3c7', borderColor: '#f59e0b' }}>
                <div className="flex items-center gap-3 mb-3">
                  <Ear className="w-6 h-6" style={{ color: '#d97706' }} />
                  <h3 className="text-lg font-bold" style={{ color: '#92400e' }}>Auditory Accessibility</h3>
                </div>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Captions and transcripts for video content</li>
                  <li>Written alternatives for audio-only content</li>
                  <li>No audio that plays automatically</li>
                  <li>Volume controls for media content</li>
                </ul>
              </div>

              {/* Motor Accessibility */}
              <div className="rounded-xl p-6 border mb-4" style={{ backgroundColor: '#f0fdf4', borderColor: '#22c55e' }}>
                <div className="flex items-center gap-3 mb-3">
                  <Keyboard className="w-6 h-6" style={{ color: '#16a34a' }} />
                  <h3 className="text-lg font-bold" style={{ color: '#15803d' }}>Motor/Mobility Accessibility</h3>
                </div>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Full keyboard navigation support throughout the platform</li>
                  <li>Skip navigation links to bypass repetitive content</li>
                  <li>Sufficient target sizes for clickable elements</li>
                  <li>No time limits that cannot be extended or disabled</li>
                  <li>Multiple input methods supported (mouse, keyboard, touch)</li>
                </ul>
              </div>

              {/* Cognitive Accessibility */}
              <div className="rounded-xl p-6 border" style={{ backgroundColor: '#fdf2f8', borderColor: '#ec4899' }}>
                <div className="flex items-center gap-3 mb-3">
                  <Brain className="w-6 h-6" style={{ color: '#db2777' }} />
                  <h3 className="text-lg font-bold" style={{ color: '#9d174d' }}>Cognitive Accessibility</h3>
                </div>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Clear, simple language in all content</li>
                  <li>Consistent and predictable navigation</li>
                  <li>Chunked content with clear headings and organization</li>
                  <li>Error prevention and clear error messages</li>
                  <li>Progress indicators for multi-step processes</li>
                  <li>Ability to save progress and resume later</li>
                </ul>
              </div>
            </section>

            {/* Section 4: Assistive Technologies */}
            <section className="mb-10 pb-10 border-b border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${BRAND.burgundy}15` }}>
                  <Hand className="w-5 h-5" style={{ color: BRAND.burgundy }} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">4. Compatibility with Assistive Technologies</h2>
              </div>
              <p className="text-gray-700 leading-relaxed mb-4">
                Our website and learning platform are designed to be compatible with the following assistive technologies:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li><strong>Screen readers:</strong> JAWS, NVDA, VoiceOver, TalkBack</li>
                <li><strong>Screen magnifiers:</strong> ZoomText, Windows Magnifier, macOS Zoom</li>
                <li><strong>Voice recognition:</strong> Dragon NaturallySpeaking, Voice Control</li>
                <li><strong>Alternative input devices:</strong> Switch devices, eye-tracking systems</li>
                <li><strong>Browser extensions:</strong> High contrast modes, text-to-speech tools</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                We test our platform regularly with these technologies to ensure compatibility. If you experience issues with a specific assistive technology, please let us know.
              </p>
            </section>

            {/* Section 5: Learning Platform Accommodations */}
            <section className="mb-10 pb-10 border-b border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${BRAND.burgundy}15` }}>
                  <Accessibility className="w-5 h-5" style={{ color: BRAND.burgundy }} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">5. Learning Platform Accommodations</h2>
              </div>
              <p className="text-gray-700 leading-relaxed mb-4">
                We understand that students may need accommodations to fully participate in our certification programs. We offer the following accommodations upon request:
              </p>
              <div className="rounded-xl p-6 border" style={{ backgroundColor: BRAND.cream, borderColor: `${BRAND.gold}30` }}>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: BRAND.burgundy }} />
                    <span><strong>Extended time</strong> on timed assessments and examinations</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: BRAND.burgundy }} />
                    <span><strong>Alternative formats</strong> for course materials (text, audio, large print)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: BRAND.burgundy }} />
                    <span><strong>Screen reader compatible</strong> versions of documents and assessments</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: BRAND.burgundy }} />
                    <span><strong>Flexible deadlines</strong> when medically necessary</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: BRAND.burgundy }} />
                    <span><strong>One-on-one support</strong> from our student success team</span>
                  </li>
                </ul>
              </div>
              <p className="text-gray-700 leading-relaxed mt-4">
                To request accommodations, please contact our Accessibility Coordinator at the email address below. We will work with you to determine appropriate accommodations based on your individual needs.
              </p>
            </section>

            {/* Section 6: Known Limitations */}
            <section className="mb-10 pb-10 border-b border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#fef2f2' }}>
                  <MessageSquare className="w-5 h-5" style={{ color: '#dc2626' }} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">6. Known Limitations</h2>
              </div>
              <p className="text-gray-700 leading-relaxed mb-4">
                While we strive for full accessibility, we acknowledge that some areas of our platform may have limitations. We are actively working to address the following:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li>Some older PDF documents may not be fully accessible; we are working to remediate these</li>
                <li>Third-party embedded content (videos, widgets) may have varying accessibility levels</li>
                <li>Some interactive course elements are being updated to improve screen reader compatibility</li>
                <li>Live video sessions may have limited real-time captioning availability</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                If you encounter any accessibility barriers, please contact us. We are committed to providing alternative access methods and continuing to improve our platform.
              </p>
            </section>

            {/* Section 7: Feedback and Assistance */}
            <section className="mb-10 pb-10 border-b border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${BRAND.burgundy}15` }}>
                  <MessageSquare className="w-5 h-5" style={{ color: BRAND.burgundy }} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">7. Feedback and Assistance</h2>
              </div>
              <p className="text-gray-700 leading-relaxed mb-4">
                We welcome your feedback on the accessibility of our website and learning platform. If you encounter any accessibility barriers or have suggestions for improvement, please let us know:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li>Describe the accessibility issue you experienced</li>
                <li>Include the URL or page where you encountered the problem</li>
                <li>Describe the assistive technology you were using (if applicable)</li>
                <li>Let us know how we can best contact you</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                We will respond to accessibility feedback within 2 business days and work to resolve issues as quickly as possible.
              </p>
            </section>

            {/* Section 8: Third-Party Content */}
            <section className="mb-10 pb-10 border-b border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${BRAND.burgundy}15` }}>
                  <Monitor className="w-5 h-5" style={{ color: BRAND.burgundy }} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">8. Third-Party Content</h2>
              </div>
              <p className="text-gray-700 leading-relaxed mb-4">
                Our website may contain links to third-party websites and embed third-party content. While we strive to link only to accessible content, we are not responsible for the accessibility practices of third-party sites.
              </p>
              <p className="text-gray-700 leading-relaxed">
                If you have difficulty accessing third-party content linked from our site, please contact the third-party site directly. You may also contact us, and we will do our best to provide an alternative way to access the information.
              </p>
            </section>

            {/* Contact Section */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${BRAND.burgundy}15` }}>
                  <Mail className="w-5 h-5" style={{ color: BRAND.burgundy }} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">9. Contact Information</h2>
              </div>
              <p className="text-gray-700 leading-relaxed mb-4">
                For accessibility-related inquiries, accommodations requests, or to report accessibility issues:
              </p>
              <div className="rounded-xl p-6 border" style={{ backgroundColor: BRAND.cream, borderColor: `${BRAND.gold}30` }}>
                <p className="font-bold text-gray-900 mb-3">Accreditation Standards Institute LLC</p>
                <div className="space-y-2 text-gray-700">
                  <p>
                    <strong>Accessibility Coordinator:</strong>{" "}
                    <a href="mailto:accessibility@accreditation-standards.org" className="hover:underline font-medium" style={{ color: BRAND.burgundy }}>
                      accessibility@accreditation-standards.org
                    </a>
                  </p>
                  <p>
                    <strong>Accommodation Requests:</strong>{" "}
                    <a href="mailto:accommodations@accreditation-standards.org" className="hover:underline font-medium" style={{ color: BRAND.burgundy }}>
                      accommodations@accreditation-standards.org
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
            <Link href="/cookie-policy">
              <Button variant="outline" className="border-gray-200 hover:border-gray-300" style={{ color: BRAND.burgundy }}>
                Cookie Policy
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" className="border-gray-200 hover:border-gray-300" style={{ color: BRAND.burgundy }}>
                Contact Us
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
