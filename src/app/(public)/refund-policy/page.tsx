import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Ban,
  Shield,
  Mail,
  Calendar,
  ArrowRight,
  MapPin,
  ChevronRight,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  CreditCard,
  HeadphonesIcon,
  AlertOctagon,
  RefreshCcw,
  Scale,
  BookOpen,
  Phone,
} from "lucide-react";

export const metadata = {
  title: "Refund Policy | Accreditation Standards Institute",
  description: "Understand ASI's refund policy for digital certification programs. All sales are final for digital products with a conditional 30-day certification guarantee.",
};

// Brand Colors from logo
const BRAND = {
  burgundy: "#722f37",
  burgundyDark: "#4e1f24",
  gold: "#d4af37",
  goldLight: "#e8c547",
  cream: "#fdf8f0",
};

export default function RefundPolicyPage() {
  const lastUpdated = "January 1, 2025";

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "white" }}>
      {/* Top Bar */}
      <div style={{ backgroundColor: BRAND.burgundyDark, color: "white", padding: "8px 16px" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "14px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
            <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <MapPin style={{ width: "12px", height: "12px", color: BRAND.gold }} />
              USA Headquarters
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <MapPin style={{ width: "12px", height: "12px", color: BRAND.gold }} />
              Dubai Office
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <Link href="/verify" style={{ color: BRAND.gold, textDecoration: "none" }}>
              Verify Credential
            </Link>
            <Link href="/directory" style={{ color: BRAND.gold, textDecoration: "none" }}>
              Find a Practitioner
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ backgroundColor: "white", borderBottom: "1px solid #f0f0f0", position: "sticky", top: 0, zIndex: 50, boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Link href="/asi-home" style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <Image
                src="/ASI_LOGO-removebg-preview.png"
                alt="Accreditation Standards Institute"
                width={160}
                height={48}
                style={{ height: "48px", width: "auto" }}
              />
            </Link>

            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <Link href="/about" style={{ padding: "8px 16px", fontWeight: 500, color: BRAND.burgundy, textDecoration: "none", display: "flex", alignItems: "center", gap: "4px" }}>
                About <ChevronRight style={{ width: "16px", height: "16px", transform: "rotate(90deg)" }} />
              </Link>
              <Link href="/standards" style={{ padding: "8px 16px", fontWeight: 500, color: BRAND.burgundy, textDecoration: "none", display: "flex", alignItems: "center", gap: "4px" }}>
                Standards <ChevronRight style={{ width: "16px", height: "16px", transform: "rotate(90deg)" }} />
              </Link>
              <Link href="/certifications" style={{ padding: "8px 16px", fontWeight: 500, color: BRAND.burgundy, textDecoration: "none", display: "flex", alignItems: "center", gap: "4px" }}>
                Certifications <ChevronRight style={{ width: "16px", height: "16px", transform: "rotate(90deg)" }} />
              </Link>
              <Link href="/directory" style={{ padding: "8px 16px", fontWeight: 500, color: BRAND.burgundy, textDecoration: "none" }}>
                Directory
              </Link>
              <Link href="/verify" style={{ padding: "8px 16px", fontWeight: 500, color: BRAND.burgundy, textDecoration: "none" }}>
                Verify
              </Link>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <Link href="/login">
                <Button variant="ghost" style={{ color: BRAND.burgundy }}>Log In</Button>
              </Link>
              <Link href="/apply">
                <Button style={{ backgroundColor: BRAND.burgundy, color: "white" }}>
                  Apply Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{ backgroundColor: BRAND.burgundyDark, color: "white", position: "relative", overflow: "hidden" }}>
        {/* Background Pattern */}
        <div style={{
          position: "absolute",
          inset: 0,
          opacity: 0.1,
          backgroundImage: `radial-gradient(circle at 2px 2px, ${BRAND.gold} 1px, transparent 0)`,
          backgroundSize: "48px 48px"
        }} />

        <div style={{ position: "relative", maxWidth: "1280px", margin: "0 auto", padding: "48px 16px" }}>
          <Link href="/asi-home" style={{ display: "inline-flex", alignItems: "center", gap: "8px", color: "#f5e6e8", textDecoration: "none", marginBottom: "24px" }}>
            <ArrowRight style={{ width: "16px", height: "16px", transform: "rotate(180deg)" }} />
            Back to ASI Home
          </Link>

          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
            <div style={{
              width: "48px",
              height: "48px",
              borderRadius: "12px",
              backgroundColor: "rgba(255,255,255,0.1)",
              backdropFilter: "blur(8px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid rgba(255,255,255,0.2)"
            }}>
              <Ban style={{ width: "24px", height: "24px", color: BRAND.gold }} />
            </div>
            <span style={{
              backgroundColor: `${BRAND.gold}20`,
              color: BRAND.gold,
              padding: "4px 12px",
              borderRadius: "9999px",
              fontSize: "14px",
              fontWeight: 500,
              border: `1px solid ${BRAND.gold}40`
            }}>
              Legal Document
            </span>
          </div>

          <h1 style={{ fontSize: "36px", fontWeight: "bold", marginBottom: "12px" }}>
            Refund Policy
          </h1>
          <p style={{ fontSize: "18px", color: "#f5e6e8", marginBottom: "16px", maxWidth: "600px" }}>
            Please read this policy carefully before purchasing any digital products from Accreditation Standards Institute (ASI).
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#f5e6e8", fontSize: "14px" }}>
            <Calendar style={{ width: "16px", height: "16px" }} />
            Last Updated: {lastUpdated}
          </div>
        </div>
      </section>

      {/* ALL SALES FINAL Warning */}
      <section style={{ backgroundColor: "#fef2f2", borderBottom: "4px solid #dc2626", padding: "24px 16px" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
            <div style={{
              width: "56px",
              height: "56px",
              borderRadius: "12px",
              backgroundColor: "#dc2626",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0
            }}>
              <AlertOctagon style={{ width: "32px", height: "32px", color: "white" }} />
            </div>
            <div>
              <h2 style={{ fontSize: "24px", fontWeight: "bold", color: "#dc2626", marginBottom: "8px" }}>
                ALL SALES ARE FINAL
              </h2>
              <p style={{ color: "#991b1b", fontSize: "16px", lineHeight: 1.6 }}>
                <strong>Due to the immediate-access nature of our digital certification programs, all purchases are FINAL and NON-REFUNDABLE once access credentials are delivered.</strong> By completing your purchase, you acknowledge that you have read this policy in its entirety and agree to these terms. The only exception is our strict 30-Day Certification Guarantee, which has specific eligibility requirements outlined below.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section style={{ backgroundColor: BRAND.cream, padding: "48px 16px" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 4px 24px rgba(0,0,0,0.08)", padding: "48px" }}>

            {/* Section 1: Policy Overview */}
            <div style={{ marginBottom: "48px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                <FileText style={{ width: "24px", height: "24px", color: BRAND.burgundy }} />
                <h2 style={{ fontSize: "24px", fontWeight: "bold", color: "#111827" }}>
                  1. Policy Overview
                </h2>
              </div>
              <p style={{ color: "#374151", lineHeight: 1.7, marginBottom: "16px" }}>
                Accreditation Standards Institute ("ASI," "we," "our," or "us") provides professional certification and educational programs delivered entirely through digital means. This Refund Policy governs all purchases of digital products and services from ASI.
              </p>
              <p style={{ color: "#374151", lineHeight: 1.7, marginBottom: "16px" }}>
                <strong style={{ color: BRAND.burgundy }}>All sales of digital products are final.</strong> Once payment is successfully processed and access credentials are delivered to your email address, your purchase is complete and non-refundable. This policy applies to all programs, including but not limited to certification courses, mini-diplomas, and supplementary materials.
              </p>
              <p style={{ color: "#374151", lineHeight: 1.7 }}>
                By completing a purchase on our platform, you expressly acknowledge and agree that you waive any right to request a refund for any reason after receiving access to course materials, except as specifically provided under our 30-Day Certification Guarantee.
              </p>
            </div>

            {/* Section 2: Nature of Digital Products */}
            <div style={{ marginBottom: "48px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                <BookOpen style={{ width: "24px", height: "24px", color: BRAND.burgundy }} />
                <h2 style={{ fontSize: "24px", fontWeight: "bold", color: "#111827" }}>
                  2. Nature of Digital Products
                </h2>
              </div>
              <p style={{ color: "#374151", lineHeight: 1.7, marginBottom: "16px" }}>
                All ASI educational products are delivered digitally and provide immediate access upon purchase. Unlike physical goods, digital products:
              </p>
              <ul style={{ marginLeft: "24px", color: "#374151", lineHeight: 1.8 }}>
                <li style={{ marginBottom: "8px" }}>Cannot be "returned" once accessed, as the content has been consumed</li>
                <li style={{ marginBottom: "8px" }}>Are immediately available in their entirety upon enrollment</li>
                <li style={{ marginBottom: "8px" }}>Contain proprietary intellectual property and trade secrets</li>
                <li style={{ marginBottom: "8px" }}>Represent significant investment in curriculum development and expert knowledge</li>
                <li>Provide lifetime access that cannot be reclaimed after delivery</li>
              </ul>
            </div>

            {/* Section 3: What This Policy Covers */}
            <div style={{ marginBottom: "48px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                <Shield style={{ width: "24px", height: "24px", color: BRAND.burgundy }} />
                <h2 style={{ fontSize: "24px", fontWeight: "bold", color: "#111827" }}>
                  3. What This Policy Covers
                </h2>
              </div>
              <p style={{ color: "#374151", lineHeight: 1.7, marginBottom: "16px" }}>
                This refund policy applies to all ASI digital products, including:
              </p>
              <div style={{ backgroundColor: BRAND.cream, borderRadius: "12px", padding: "24px", border: `1px solid ${BRAND.burgundy}20` }}>
                <ul style={{ color: "#374151", lineHeight: 1.8, margin: 0, paddingLeft: "24px" }}>
                  <li style={{ marginBottom: "8px" }}><strong>Professional Certification Programs:</strong> All levels (Foundation, Professional, Board Certified, Master Practitioner)</li>
                  <li style={{ marginBottom: "8px" }}><strong>Specialization Certifications:</strong> Functional Medicine, Women's Health, Gut Health, Nutrition, Mind-Body, and all other specialty tracks</li>
                  <li style={{ marginBottom: "8px" }}><strong>Mini-Diplomas:</strong> Paid mini-diploma programs (free mini-diplomas are excluded)</li>
                  <li style={{ marginBottom: "8px" }}><strong>Course Bundles:</strong> Multi-course packages and pathway programs</li>
                  <li style={{ marginBottom: "8px" }}><strong>Supplementary Materials:</strong> Workbooks, templates, tools, and resources</li>
                  <li><strong>Membership Programs:</strong> Monthly or annual subscription services</li>
                </ul>
              </div>
            </div>

            {/* Section 4: No Refund Circumstances */}
            <div style={{ marginBottom: "48px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                <XCircle style={{ width: "24px", height: "24px", color: BRAND.burgundy }} />
                <h2 style={{ fontSize: "24px", fontWeight: "bold", color: "#111827" }}>
                  4. Circumstances That Do NOT Qualify for Refund
                </h2>
              </div>
              <p style={{ color: "#374151", lineHeight: 1.7, marginBottom: "16px" }}>
                The following circumstances <strong>do not entitle you to any refund, credit, or exchange</strong> under any circumstances:
              </p>
              <div style={{ backgroundColor: "#fef2f2", borderRadius: "12px", padding: "24px", border: "1px solid #fecaca" }}>
                <ul style={{ color: "#991b1b", lineHeight: 1.8, margin: 0, paddingLeft: "24px" }}>
                  <li style={{ marginBottom: "8px" }}><strong>"I changed my mind"</strong> or buyer's remorse after purchase</li>
                  <li style={{ marginBottom: "8px" }}><strong>"I don't have time"</strong> to complete the course or program</li>
                  <li style={{ marginBottom: "8px" }}><strong>"The course wasn't what I expected"</strong> (without completing the material)</li>
                  <li style={{ marginBottom: "8px" }}><strong>"I found similar information elsewhere"</strong> or already knew the content</li>
                  <li style={{ marginBottom: "8px" }}><strong>"My financial situation has changed"</strong> after purchase</li>
                  <li style={{ marginBottom: "8px" }}><strong>"My spouse/partner/family doesn't support my decision"</strong></li>
                  <li style={{ marginBottom: "8px" }}><strong>"I decided to pursue a different career path"</strong></li>
                  <li style={{ marginBottom: "8px" }}><strong>"The program is too difficult"</strong> or doesn't match my learning style</li>
                  <li style={{ marginBottom: "8px" }}><strong>Technical issues on your end</strong> (internet connection, device compatibility, etc.)</li>
                  <li style={{ marginBottom: "8px" }}><strong>Failure to access the course</strong> within any time period</li>
                  <li style={{ marginBottom: "8px" }}><strong>Forgetting about the program</strong> or life circumstances preventing study</li>
                  <li><strong>Dissatisfaction without making genuine effort</strong> to complete the program</li>
                </ul>
              </div>
            </div>

            {/* Section 5: 30-Day Certification Guarantee */}
            <div style={{ marginBottom: "48px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                <RefreshCcw style={{ width: "24px", height: "24px", color: BRAND.burgundy }} />
                <h2 style={{ fontSize: "24px", fontWeight: "bold", color: "#111827" }}>
                  5. 30-Day Certification Guarantee (Conditional)
                </h2>
              </div>
              <p style={{ color: "#374151", lineHeight: 1.7, marginBottom: "16px" }}>
                ASI offers a <strong>conditional</strong> 30-Day Certification Guarantee for our Professional and Board Certified level programs only. This guarantee is NOT a general money-back guarantee. It is strictly limited to situations where a student has made a genuine, documented effort to complete and pass the certification but was unable to do so.
              </p>
              <div style={{ backgroundColor: `${BRAND.gold}15`, borderRadius: "12px", padding: "24px", border: `1px solid ${BRAND.gold}40`, marginBottom: "16px" }}>
                <p style={{ color: BRAND.burgundyDark, fontWeight: 600, marginBottom: "8px" }}>
                  Important: This guarantee does NOT apply to:
                </p>
                <ul style={{ color: BRAND.burgundyDark, lineHeight: 1.6, margin: 0, paddingLeft: "24px" }}>
                  <li>Mini-Diploma programs (free or paid)</li>
                  <li>Foundation Level certifications</li>
                  <li>Course bundles or supplementary materials</li>
                  <li>Membership programs or subscriptions</li>
                </ul>
              </div>
            </div>

            {/* Section 6: Guarantee Eligibility Requirements */}
            <div style={{ marginBottom: "48px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                <CheckCircle style={{ width: "24px", height: "24px", color: BRAND.burgundy }} />
                <h2 style={{ fontSize: "24px", fontWeight: "bold", color: "#111827" }}>
                  6. Guarantee Eligibility Requirements
                </h2>
              </div>
              <p style={{ color: "#374151", lineHeight: 1.7, marginBottom: "16px" }}>
                To be eligible for consideration under the 30-Day Certification Guarantee, you must satisfy <strong>ALL</strong> of the following requirements within thirty (30) calendar days from the date of enrollment:
              </p>
              <div style={{ backgroundColor: "#f0fdf4", borderRadius: "12px", padding: "24px", border: "1px solid #bbf7d0" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                  <CheckCircle style={{ width: "20px", height: "20px", color: "#16a34a" }} />
                  <h3 style={{ fontWeight: "bold", color: "#166534" }}>Mandatory Requirements (ALL must be met)</h3>
                </div>
                <ul style={{ color: "#166534", lineHeight: 1.8, margin: 0, paddingLeft: "24px" }}>
                  <li style={{ marginBottom: "8px" }}>Complete <strong>100% of all course modules</strong> and lessons (verified by our system)</li>
                  <li style={{ marginBottom: "8px" }}>Submit <strong>all required assignments</strong> and practical exercises</li>
                  <li style={{ marginBottom: "8px" }}>Attempt the <strong>certification exam at least 3 times</strong> with a minimum 24-hour gap between attempts</li>
                  <li style={{ marginBottom: "8px" }}>Attend or watch recordings of <strong>all live coaching sessions</strong> (if applicable to your program)</li>
                  <li style={{ marginBottom: "8px" }}>Achieve a minimum of <strong>65% on all module quizzes</strong> (showing genuine effort)</li>
                  <li style={{ marginBottom: "8px" }}>Participate in your assigned <strong>accountability pod</strong> with documented check-ins</li>
                  <li style={{ marginBottom: "8px" }}>Schedule and complete at least <strong>2 calls with your Success Coach</strong></li>
                  <li style={{ marginBottom: "8px" }}>Provide <strong>documented evidence</strong> of all the above with screenshots, timestamps, and completion certificates</li>
                  <li>Contact <strong>support BEFORE requesting a refund</strong> to attempt resolution</li>
                </ul>
              </div>
              <p style={{ color: "#374151", lineHeight: 1.7, marginTop: "16px" }}>
                ASI reserves the right to independently verify all claims through login records, learning analytics, exam attempt history, and progress reports. Any inconsistency, misrepresentation, or failure to meet any single requirement will result in immediate denial.
              </p>
            </div>

            {/* Section 7: How to Request Guarantee Review */}
            <div style={{ marginBottom: "48px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                <Clock style={{ width: "24px", height: "24px", color: BRAND.burgundy }} />
                <h2 style={{ fontSize: "24px", fontWeight: "bold", color: "#111827" }}>
                  7. How to Request Guarantee Review
                </h2>
              </div>
              <p style={{ color: "#374151", lineHeight: 1.7, marginBottom: "16px" }}>
                If you believe you qualify for the 30-Day Certification Guarantee, you must follow this exact procedure:
              </p>
              <ol style={{ marginLeft: "24px", color: "#374151", lineHeight: 1.8 }}>
                <li style={{ marginBottom: "12px" }}>
                  <strong>Contact Support First:</strong> Email <a href="mailto:legal@accredipro.academy" style={{ color: BRAND.burgundy, fontWeight: 500 }}>legal@accredipro.academy</a> with subject line "Guarantee Review Request - [Your Full Name]"
                </li>
                <li style={{ marginBottom: "12px" }}>
                  <strong>Include Required Information:</strong> Full name, email address, enrollment date, program name, and a detailed explanation of why you are requesting a review
                </li>
                <li style={{ marginBottom: "12px" }}>
                  <strong>Attach All Documentation:</strong> Screenshots of 100% completion, all exam attempt results, quiz scores, coaching call confirmations, and pod participation records
                </li>
                <li style={{ marginBottom: "12px" }}>
                  <strong>Wait for Review:</strong> Allow 10-15 business days for our team to verify your claims against our records
                </li>
                <li style={{ marginBottom: "12px" }}>
                  <strong>Respond Promptly:</strong> If additional documentation is requested, you must provide it within 7 business days or your request will be automatically denied
                </li>
              </ol>
              <p style={{ color: "#374151", lineHeight: 1.7, marginTop: "16px" }}>
                <strong>Note:</strong> Approval of guarantee requests is not automatic and is at the sole discretion of ASI. Meeting the minimum requirements does not guarantee approval.
              </p>
            </div>

            {/* Section 8: Payment Plan Obligations */}
            <div style={{ marginBottom: "48px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                <CreditCard style={{ width: "24px", height: "24px", color: BRAND.burgundy }} />
                <h2 style={{ fontSize: "24px", fontWeight: "bold", color: "#111827" }}>
                  8. Payment Plan Obligations
                </h2>
              </div>
              <p style={{ color: "#374151", lineHeight: 1.7, marginBottom: "16px" }}>
                If you enrolled using a payment plan, you are legally obligated to complete all scheduled payments regardless of:
              </p>
              <ul style={{ marginLeft: "24px", color: "#374151", lineHeight: 1.8, marginBottom: "16px" }}>
                <li style={{ marginBottom: "8px" }}>Whether you complete the program</li>
                <li style={{ marginBottom: "8px" }}>Whether you access the course materials</li>
                <li style={{ marginBottom: "8px" }}>Whether you pass or fail the certification exam</li>
                <li style={{ marginBottom: "8px" }}>Any change in your personal, financial, or professional circumstances</li>
                <li>Your satisfaction with the program</li>
              </ul>
              <div style={{ backgroundColor: "#fef2f2", borderRadius: "12px", padding: "24px", border: "1px solid #fecaca" }}>
                <p style={{ color: "#991b1b", fontWeight: 600, marginBottom: "8px" }}>
                  Payment Plan Default Consequences:
                </p>
                <ul style={{ color: "#991b1b", lineHeight: 1.6, margin: 0, paddingLeft: "24px" }}>
                  <li style={{ marginBottom: "8px" }}>Immediate suspension of course access</li>
                  <li style={{ marginBottom: "8px" }}>Full remaining balance becomes immediately due</li>
                  <li style={{ marginBottom: "8px" }}>Late fees and collection costs may be added</li>
                  <li style={{ marginBottom: "8px" }}>Account may be sent to collections</li>
                  <li>Reporting to credit bureaus may occur</li>
                </ul>
              </div>
            </div>

            {/* Section 9: Chargebacks and Disputes */}
            <div style={{ marginBottom: "48px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                <AlertTriangle style={{ width: "24px", height: "24px", color: BRAND.burgundy }} />
                <h2 style={{ fontSize: "24px", fontWeight: "bold", color: "#111827" }}>
                  9. Chargebacks and Payment Disputes
                </h2>
              </div>
              <p style={{ color: "#374151", lineHeight: 1.7, marginBottom: "16px" }}>
                By enrolling in our programs, you agree to resolve any payment disputes directly with ASI <strong>before</strong> initiating a chargeback with your financial institution. Filing a chargeback after receiving course access is considered fraudulent and will result in:
              </p>
              <div style={{ backgroundColor: "#fef2f2", borderRadius: "12px", padding: "24px", border: "2px solid #dc2626" }}>
                <p style={{ color: "#dc2626", fontWeight: "bold", marginBottom: "12px", fontSize: "18px" }}>
                  Consequences of Fraudulent Chargebacks:
                </p>
                <ul style={{ color: "#991b1b", lineHeight: 1.8, margin: 0, paddingLeft: "24px" }}>
                  <li style={{ marginBottom: "8px" }}><strong>Immediate termination</strong> of all account access across all ASI platforms</li>
                  <li style={{ marginBottom: "8px" }}><strong>Permanent revocation</strong> of any certificates, credentials, or certifications issued</li>
                  <li style={{ marginBottom: "8px" }}><strong>Removal from the ASI Directory</strong> and all professional listings</li>
                  <li style={{ marginBottom: "8px" }}><strong>Collection of the full amount</strong> plus fees, damages, and legal costs</li>
                  <li style={{ marginBottom: "8px" }}><strong>Reporting to fraud prevention databases</strong> used by other educational institutions</li>
                  <li style={{ marginBottom: "8px" }}><strong>Potential legal action</strong> for fraud and breach of contract</li>
                  <li><strong>Permanent ban</strong> from all future ASI programs and services</li>
                </ul>
              </div>
              <p style={{ color: "#374151", lineHeight: 1.7, marginTop: "16px" }}>
                We vigorously contest all chargebacks and maintain detailed records of course access, login history, content consumption, and acceptance of terms at checkout.
              </p>
            </div>

            {/* Section 10: Technical Issues */}
            <div style={{ marginBottom: "48px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                <HeadphonesIcon style={{ width: "24px", height: "24px", color: BRAND.burgundy }} />
                <h2 style={{ fontSize: "24px", fontWeight: "bold", color: "#111827" }}>
                  10. Technical Issues
                </h2>
              </div>
              <p style={{ color: "#374151", lineHeight: 1.7, marginBottom: "16px" }}>
                Technical difficulties are not grounds for a refund. However, we are committed to helping you access our content. If you experience technical issues:
              </p>
              <ul style={{ marginLeft: "24px", color: "#374151", lineHeight: 1.8, marginBottom: "16px" }}>
                <li style={{ marginBottom: "8px" }}>Contact our support team at <a href="mailto:legal@accredipro.academy" style={{ color: BRAND.burgundy, fontWeight: 500 }}>legal@accredipro.academy</a></li>
                <li style={{ marginBottom: "8px" }}>Provide specific details about the issue (error messages, screenshots, browser/device info)</li>
                <li style={{ marginBottom: "8px" }}>Our team will respond within 24-48 business hours</li>
                <li>We will work to resolve any platform-side technical issues promptly</li>
              </ul>
              <p style={{ color: "#374151", lineHeight: 1.7 }}>
                <strong>Note:</strong> Issues caused by your internet connection, device, browser, firewall settings, or other factors outside our control are your responsibility to resolve.
              </p>
            </div>

            {/* Section 11: Program Cancellations by ASI */}
            <div style={{ marginBottom: "48px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                <Scale style={{ width: "24px", height: "24px", color: BRAND.burgundy }} />
                <h2 style={{ fontSize: "24px", fontWeight: "bold", color: "#111827" }}>
                  11. Program Cancellations by ASI
                </h2>
              </div>
              <p style={{ color: "#374151", lineHeight: 1.7, marginBottom: "16px" }}>
                In the rare event that ASI cancels a program before you have completed it:
              </p>
              <ul style={{ marginLeft: "24px", color: "#374151", lineHeight: 1.8, marginBottom: "16px" }}>
                <li style={{ marginBottom: "8px" }}>You will be offered enrollment in an equivalent program at no additional cost</li>
                <li style={{ marginBottom: "8px" }}>If no equivalent program is available, a prorated credit will be issued for unused portions</li>
                <li style={{ marginBottom: "8px" }}>Credits can be applied to any other ASI program within 12 months</li>
                <li>Cash refunds are issued only at ASI's sole discretion and are not guaranteed</li>
              </ul>
              <p style={{ color: "#374151", lineHeight: 1.7 }}>
                This does not apply to program updates, curriculum revisions, or changes to course content, which occur regularly as part of our commitment to providing current, evidence-based education.
              </p>
            </div>

            {/* Section 12: Contact Information */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                <Mail style={{ width: "24px", height: "24px", color: BRAND.burgundy }} />
                <h2 style={{ fontSize: "24px", fontWeight: "bold", color: "#111827" }}>
                  12. Contact Information
                </h2>
              </div>
              <p style={{ color: "#374151", lineHeight: 1.7, marginBottom: "16px" }}>
                For questions about this refund policy or to discuss your situation, please contact us:
              </p>
              <div style={{ backgroundColor: BRAND.cream, borderRadius: "12px", padding: "24px", border: `1px solid ${BRAND.burgundy}20` }}>
                <p style={{ color: BRAND.burgundyDark, fontWeight: "bold", fontSize: "18px", marginBottom: "12px" }}>
                  Accreditation Standards Institute
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <p style={{ color: "#374151", display: "flex", alignItems: "center", gap: "8px" }}>
                    <Mail style={{ width: "16px", height: "16px", color: BRAND.burgundy }} />
                    Email: <a href="mailto:legal@accredipro.academy" style={{ color: BRAND.burgundy, fontWeight: 500 }}>legal@accredipro.academy</a>
                  </p>
                  <p style={{ color: "#374151", display: "flex", alignItems: "center", gap: "8px" }}>
                    <MapPin style={{ width: "16px", height: "16px", color: BRAND.burgundy }} />
                    USA Headquarters | Dubai Office
                  </p>
                </div>
                <p style={{ color: "#6b7280", fontSize: "14px", marginTop: "16px" }}>
                  Response time: 24-48 business hours for initial response
                </p>
              </div>
            </div>

          </div>

          {/* Related Links */}
          <div style={{ marginTop: "32px", display: "flex", flexWrap: "wrap", gap: "16px", justifyContent: "center" }}>
            <Link href="/terms-of-service">
              <Button variant="outline" style={{ borderColor: BRAND.burgundy, color: BRAND.burgundy }}>
                Terms of Service
              </Button>
            </Link>
            <Link href="/privacy-policy">
              <Button variant="outline" style={{ borderColor: BRAND.burgundy, color: BRAND.burgundy }}>
                Privacy Policy
              </Button>
            </Link>
            <Link href="/code-of-ethics">
              <Button variant="outline" style={{ borderColor: BRAND.burgundy, color: BRAND.burgundy }}>
                Code of Ethics
              </Button>
            </Link>
            <Link href="/credential-terms">
              <Button variant="outline" style={{ borderColor: BRAND.burgundy, color: BRAND.burgundy }}>
                Credential Terms
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ backgroundColor: BRAND.burgundyDark, color: "white", padding: "64px 16px" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "32px", marginBottom: "48px" }}>
            {/* Logo & Info */}
            <div style={{ gridColumn: "span 2" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
                <div style={{ width: "48px", height: "48px", borderRadius: "8px", backgroundColor: BRAND.gold, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Shield style={{ width: "28px", height: "28px", color: BRAND.burgundyDark }} />
                </div>
                <div>
                  <div style={{ fontWeight: "bold", fontSize: "18px", letterSpacing: "-0.02em", color: "white" }}>ACCREDITATION STANDARDS</div>
                  <div style={{ fontSize: "12px", letterSpacing: "0.1em", color: BRAND.gold }}>INSTITUTE</div>
                </div>
              </div>
              <p style={{ color: "#f5e6e8", marginBottom: "24px", maxWidth: "360px" }}>
                The global authority in functional medicine and health certification.
                Setting standards. Building careers.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "14px", color: "#f5e6e8" }}>
                <p style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <MapPin style={{ width: "16px", height: "16px", color: BRAND.gold }} />
                  USA Headquarters
                </p>
                <p style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <MapPin style={{ width: "16px", height: "16px", color: BRAND.gold }} />
                  Dubai Office
                </p>
              </div>
            </div>

            {/* Links */}
            <div>
              <h4 style={{ fontWeight: "bold", marginBottom: "16px", color: BRAND.gold }}>Certifications</h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "8px", fontSize: "14px", color: "#f5e6e8" }}>
                <li><Link href="/certifications" style={{ color: "inherit", textDecoration: "none" }}>All Certifications</Link></li>
                <li><Link href="/certifications/functional-medicine" style={{ color: "inherit", textDecoration: "none" }}>Functional Medicine</Link></li>
                <li><Link href="/certifications/womens-health" style={{ color: "inherit", textDecoration: "none" }}>Women's Health</Link></li>
                <li><Link href="/certifications/gut-health" style={{ color: "inherit", textDecoration: "none" }}>Gut Health</Link></li>
                <li><Link href="/certifications/nutrition" style={{ color: "inherit", textDecoration: "none" }}>Nutrition</Link></li>
              </ul>
            </div>

            <div>
              <h4 style={{ fontWeight: "bold", marginBottom: "16px", color: BRAND.gold }}>Company</h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "8px", fontSize: "14px", color: "#f5e6e8" }}>
                <li><Link href="/about" style={{ color: "inherit", textDecoration: "none" }}>About ASI</Link></li>
                <li><Link href="/standards" style={{ color: "inherit", textDecoration: "none" }}>Our Standards</Link></li>
                <li><Link href="/leadership" style={{ color: "inherit", textDecoration: "none" }}>Leadership</Link></li>
                <li><Link href="/code-of-ethics" style={{ color: "inherit", textDecoration: "none" }}>Code of Ethics</Link></li>
                <li><Link href="/contact" style={{ color: "inherit", textDecoration: "none" }}>Contact</Link></li>
              </ul>
            </div>

            <div>
              <h4 style={{ fontWeight: "bold", marginBottom: "16px", color: BRAND.gold }}>Resources</h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "8px", fontSize: "14px", color: "#f5e6e8" }}>
                <li><Link href="/verify" style={{ color: "inherit", textDecoration: "none" }}>Verify Credential</Link></li>
                <li><Link href="/directory" style={{ color: "inherit", textDecoration: "none" }}>Find a Practitioner</Link></li>
                <li><Link href="/employers" style={{ color: "inherit", textDecoration: "none" }}>For Employers</Link></li>
                <li><Link href="/partners" style={{ color: "inherit", textDecoration: "none" }}>Partner With Us</Link></li>
                <li><Link href="/faq" style={{ color: "inherit", textDecoration: "none" }}>FAQ</Link></li>
              </ul>
            </div>
          </div>

          <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "32px", display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
            <p style={{ fontSize: "14px", color: "#f5e6e8" }}>
              &copy; 2025 Accreditation Standards Institute. All rights reserved.
            </p>
            <div style={{ display: "flex", gap: "24px", fontSize: "14px", color: "#f5e6e8" }}>
              <Link href="/privacy-policy" style={{ color: "inherit", textDecoration: "none" }}>Privacy Policy</Link>
              <Link href="/terms-of-service" style={{ color: "inherit", textDecoration: "none" }}>Terms of Service</Link>
              <Link href="/refund-policy" style={{ color: BRAND.gold, textDecoration: "none", fontWeight: 500 }}>Refund Policy</Link>
              <Link href="/health-disclaimer" style={{ color: "inherit", textDecoration: "none" }}>Health Disclaimer</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
