import Link from "next/link";
import { Shield, Mail, Calendar, ArrowLeft, FileText, Scale, AlertTriangle, CreditCard, BookOpen, Users, Building2, Gavel, Ban, Eye, FileCheck, UserCheck, Lock, Globe, Bell, RefreshCw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function TermsOfServicePage() {
  const lastUpdated = "December 31, 2024";

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-burgundy-700 via-burgundy-600 to-burgundy-800 text-white">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <Link href="/" className="inline-flex items-center gap-2 text-burgundy-200 hover:text-white mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to AccrediPro
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
              <Scale className="w-6 h-6 text-gold-400" />
            </div>
            <Badge className="bg-gold-400/20 text-gold-300 border-gold-400/30">
              Legal Document
            </Badge>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Terms of Service</h1>
          <p className="text-burgundy-100 text-lg mb-2">
            Digital Product Purchase Agreement
          </p>
          <p className="text-burgundy-200 mb-4">
            AccrediPro LLC — A Wyoming Limited Liability Company
          </p>
          <div className="flex items-center gap-2 text-burgundy-200 text-sm">
            <Calendar className="w-4 h-4" />
            Last Updated: {lastUpdated}
          </div>
        </div>
      </div>

      {/* Important Notice */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-amber-800 mb-2">Please Read Carefully Before Purchasing</h3>
              <p className="text-amber-700 text-sm leading-relaxed">
                This document constitutes a legally binding agreement between you and AccrediPro LLC. By completing your purchase, you acknowledge that you have read, understood, and agree to be bound by all terms and conditions set forth herein. Your electronic acceptance has the same legal effect as a handwritten signature.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 pb-12">
        <Card className="border-0 shadow-lg">
          <CardContent className="p-8 md:p-12 prose prose-burgundy max-w-none">

            {/* Article I */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Building2 className="w-6 h-6 text-burgundy-600" />
                Article I: Parties and Agreement
              </h2>

              <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">1.1 Contracting Parties</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                This Terms of Service and Digital Product Purchase Agreement ("Agreement") is entered into between:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li><strong>Company:</strong> AccrediPro LLC, a Wyoming Limited Liability Company, with principal offices at 1309 Coffeen Avenue STE 1200, Sheridan, Wyoming 82801, United States ("Company," "We," "Us," or "Our")</li>
                <li><strong>Purchaser:</strong> The individual or entity completing this purchase ("You," "Your," "Purchaser," or "Student")</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">1.2 Method of Acceptance</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                You accept this Agreement and become legally bound by its terms through any of the following actions:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li>Clicking "I Agree," "Purchase Now," "Enroll Now," or any similar acceptance button</li>
                <li>Checking any checkbox indicating agreement to these terms</li>
                <li>Completing payment for any digital product or service</li>
                <li>Accessing, logging into, viewing, streaming, or downloading any course materials</li>
                <li>Creating an account on our learning management platform</li>
                <li>Participating in any community features, forums, or group coaching sessions</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">1.3 Electronic Signatures</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Pursuant to the Electronic Signatures in Global and National Commerce Act (E-SIGN Act, 15 U.S.C. § 7001 et seq.) and the Uniform Electronic Transactions Act (UETA), your electronic acceptance of this Agreement constitutes a valid and binding signature with the same legal force and effect as a handwritten signature. You expressly waive any right to challenge the validity, enforceability, or admissibility of your electronic signature or this electronically executed Agreement.
              </p>

              <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">1.4 Eligibility</h3>
              <p className="text-gray-700 leading-relaxed mb-4">By entering into this Agreement, you represent and warrant that:</p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>You are at least 18 years of age or the age of majority in your jurisdiction</li>
                <li>You have the legal capacity to enter into binding contracts</li>
                <li>You are not barred from purchasing or receiving digital products under applicable law</li>
                <li>If purchasing on behalf of an organization, you have authority to bind that organization</li>
              </ul>
            </section>

            {/* Article II */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-burgundy-600" />
                Article II: Nature of Digital Products
              </h2>

              <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">2.1 Definition of Digital Products</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                "Digital Products" means all electronically delivered content, materials, and services including but not limited to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li>Online courses, certification programs, and educational curricula</li>
                <li>Video lectures, tutorials, and recorded training sessions</li>
                <li>Audio recordings, podcasts, and guided meditations</li>
                <li>Written materials, eBooks, PDFs, workbooks, and worksheets</li>
                <li>Templates, scripts, frameworks, and business tools</li>
                <li>Assessments, quizzes, examinations, and certification tests</li>
                <li>Community access, forums, and group coaching platforms</li>
                <li>Mentorship, support, and coaching communications</li>
                <li>Any other educational or training materials delivered electronically</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">2.2 Immediate Delivery and Access</h3>
              <p className="text-gray-700 leading-relaxed mb-4">You understand and acknowledge that:</p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li>Digital Products are delivered immediately upon successful payment processing</li>
                <li>Access credentials are transmitted to your registered email address within sixty (60) seconds of purchase confirmation</li>
                <li>The transmission of access credentials constitutes full and complete delivery of the purchased Digital Products</li>
                <li>Your choice to access or not access the materials does not affect delivery status</li>
                <li>Digital Products, once delivered, cannot be "returned" in the manner of physical goods</li>
                <li>The intangible and immediately accessible nature of Digital Products makes traditional returns impossible</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">2.3 Lifetime Access</h3>
              <p className="text-gray-700 leading-relaxed mb-4">Subject to compliance with this Agreement, purchased courses include lifetime access, which means:</p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li>You may access course content for as long as AccrediPro operates the platform</li>
                <li>You will receive updates and improvements to course content at no additional charge</li>
                <li>Access is contingent upon continued compliance with all terms herein</li>
                <li>In the event AccrediPro ceases operations, you retain any materials previously downloaded</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">2.4 Technical Requirements</h3>
              <p className="text-gray-700 leading-relaxed mb-4">You are solely responsible for:</p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Obtaining and maintaining compatible devices, software, and internet connectivity</li>
                <li>All costs associated with accessing our platform including internet service fees</li>
                <li>Ensuring your equipment meets minimum technical specifications for streaming video content</li>
                <li>Troubleshooting issues on your end related to your equipment or internet service</li>
              </ul>
            </section>

            {/* Article III */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <CreditCard className="w-6 h-6 text-burgundy-600" />
                Article III: Payment Terms
              </h2>

              <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">3.1 Pricing and Currency</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                All prices are listed in United States Dollars (USD) unless otherwise specified. Prices are subject to change without prior notice; however, the price at the time of your purchase shall apply to your transaction. Prices do not include applicable sales tax, VAT, or other local taxes, which are your responsibility.
              </p>

              <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">3.2 Payment Processing</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Payments are processed securely through our third-party payment processors. By submitting payment, you authorize us to charge the payment method provided for the total amount of your purchase. We do not store complete credit card information on our servers.
              </p>

              <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">3.3 Order Confirmation</h3>
              <p className="text-gray-700 leading-relaxed mb-4">Upon successful payment processing, you will receive:</p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li>An order confirmation email within sixty (60) seconds</li>
                <li>Login credentials to access your student dashboard</li>
                <li>A receipt for your records and tax purposes</li>
                <li>Instructions for accessing your purchased Digital Products</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">3.4 Failed Payments</h3>
              <p className="text-gray-700 leading-relaxed">
                If your payment is declined or fails for any reason, you will not receive access to Digital Products. We reserve the right to suspend or terminate accounts with outstanding payment obligations or failed payment attempts.
              </p>
            </section>

            {/* Article IV - Refund Policy */}
            <section className="mb-10">
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 mb-6">
                <h2 className="text-2xl font-bold text-red-800 mb-2 flex items-center gap-2">
                  <Ban className="w-6 h-6" />
                  Article IV: Refund Policy – All Sales Final
                </h2>
                <p className="text-red-700 font-bold text-lg">
                  ALL SALES ARE FINAL. NO REFUNDS.
                </p>
                <p className="text-red-600 text-sm mt-2">
                  This policy applies to all Digital Products regardless of whether you access the materials, complete the program, or are satisfied with your purchase.
                </p>
              </div>

              <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">4.1 Finality of Purchase</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Once payment is successfully processed and access credentials are delivered to your email address, your purchase is complete and final. Due to the immediate-access nature of Digital Products, you expressly acknowledge and agree that:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li>You waive any right to request a refund for any reason whatsoever</li>
                <li>You waive any right to cancel your purchase after payment processing</li>
                <li>You waive any right to initiate a payment dispute or chargeback with your financial institution</li>
                <li>You waive any right to claim non-delivery of Digital Products after receiving access credentials</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">4.2 Circumstances That Do Not Qualify for Refund</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                The following circumstances, whether occurring individually or in combination, do not entitle you to any refund, credit, exchange, or chargeback:
              </p>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">Personal Circumstances</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Change of mind or decision</li>
                    <li>• Lack of available time</li>
                    <li>• Financial hardship</li>
                    <li>• Job loss or income reduction</li>
                    <li>• Family disapproval</li>
                    <li>• Health issues or medical conditions</li>
                    <li>• Relocation or travel</li>
                    <li>• Personal stress or burnout</li>
                  </ul>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">Subjective Reasons</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Not meeting personal expectations</li>
                    <li>• Content too basic or advanced</li>
                    <li>• Already knowing the material</li>
                    <li>• Not the "right fit"</li>
                    <li>• Disliking teaching style</li>
                    <li>• Not having accessed the product</li>
                    <li>• Forgetting about the purchase</li>
                    <li>• Finding a cheaper alternative</li>
                  </ul>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">4.3 Waiver of Cooling-Off Period</h3>
              <p className="text-gray-700 leading-relaxed">
                You expressly acknowledge that because Digital Products are delivered immediately upon purchase and you have immediate access to the materials, you knowingly and voluntarily waive any statutory "cooling-off" period, right of withdrawal, cancellation right, or similar consumer protection that might otherwise apply under federal, state, or local law.
              </p>
            </section>

            {/* Article V - Certification Guarantee */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FileCheck className="w-6 h-6 text-burgundy-600" />
                Article V: Conditional 30-Day Certification Guarantee
              </h2>

              <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">5.1 Limited Guarantee Scope</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                The sole and exclusive circumstance under which a refund may be considered is our Certification Guarantee, which applies only to certification programs and requires strict compliance with all conditions set forth below. This guarantee does not apply to non-certification products, add-ons, bonuses, or supplementary materials.
              </p>

              <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">5.2 Mandatory Eligibility Requirements</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                To be eligible for consideration under the Certification Guarantee, you must satisfy each and every one of the following requirements within thirty (30) calendar days from the date of enrollment:
              </p>
              <ol className="list-decimal pl-6 text-gray-700 space-y-3 mb-4">
                <li><strong>100% Course Completion:</strong> Complete all video lessons, modules, written materials, and supplementary content as verified by our learning management system analytics.</li>
                <li><strong>Three (3) Certification Exam Attempts:</strong> Attempt the final certification examination at least three (3) separate times, with a minimum of ten (10) documented hours of study and review between each attempt.</li>
                <li><strong>Twenty (20) Community Contributions:</strong> Post a minimum of twenty (20) substantive contributions within the student community platform.</li>
                <li><strong>Five (5) Support Interactions:</strong> Submit at least five (5) support tickets, mentor coaching requests, or help desk inquiries.</li>
                <li><strong>Three (3) Coaching Sessions:</strong> Attend or view recordings of at least three (3) group coaching calls or recorded support sessions.</li>
                <li><strong>All Assignments Completed:</strong> Submit all required assignments with a minimum passing score of seventy percent (70%) on each.</li>
                <li><strong>Sworn Written Statement:</strong> Submit a signed written statement attesting that all work was completed personally and authentically.</li>
                <li><strong>No Certification Claimed:</strong> You must NOT have already received, claimed, downloaded, or used your certification credentials.</li>
              </ol>

              <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">5.4 Guarantee Request Procedure</h3>
              <p className="text-gray-700 leading-relaxed mb-4">To submit a Certification Guarantee request:</p>
              <ol className="list-decimal pl-6 text-gray-700 space-y-2">
                <li>Email info@accredipro.academy within thirty (30) calendar days of enrollment</li>
                <li>Include your full legal name, order number, and account email address</li>
                <li>Provide a detailed explanation of your efforts to complete the program</li>
                <li>Attach documentation evidencing satisfaction of all requirements</li>
                <li>Include the signed written statement</li>
                <li>Allow five to seven (5-7) business days for review and verification</li>
              </ol>
            </section>

            {/* Article VI - Chargebacks */}
            <section className="mb-10">
              <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-6 mb-6">
                <h2 className="text-xl font-bold text-amber-800 mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Article VI: Payment Disputes and Chargebacks
                </h2>
                <p className="text-amber-700 text-sm">
                  <strong>Important Notice:</strong> Initiating a chargeback or payment dispute after accessing Digital Products, without first attempting resolution through our support channels, constitutes a material breach of this Agreement and may be considered fraudulent activity under applicable law.
                </p>
              </div>

              <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">6.1 Chargeback Waiver</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                You expressly agree not to initiate any chargeback, payment dispute, retrieval request, or transaction reversal through your bank, credit card issuer, payment processor, or any financial institution for any reason other than documented and verified identity theft supported by a police report.
              </p>

              <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">6.3 Consequences of Fraudulent Chargeback</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                In the event you initiate a Fraudulent Chargeback, you agree that AccrediPro may pursue any or all of the following remedies:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Immediate termination of all access to all products, services, and platforms</li>
                <li>Contest the chargeback by providing documentary evidence of delivery and access</li>
                <li>Report the incident to fraud prevention databases and merchant alert systems</li>
                <li>Report unpaid obligations to credit reporting agencies as permitted by law</li>
                <li>Refer the matter to collections agencies for recovery of amounts owed</li>
                <li>Pursue civil litigation for breach of contract, fraud, conversion, and unjust enrichment</li>
                <li>Seek recovery of all damages, costs, attorney's fees, and collection expenses</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">6.5 Mandatory Pre-Dispute Resolution</h3>
              <p className="text-gray-700 leading-relaxed">
                Before initiating any chargeback, payment dispute, or legal action, you agree to first contact AccrediPro directly at info@accredipro.academy and allow forty-eight (48) business hours for response and investigation.
              </p>
            </section>

            {/* Article VII - Data Collection */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Eye className="w-6 h-6 text-burgundy-600" />
                Article VII: Evidence Collection and Documentation
              </h2>

              <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">7.1 Consent to Data Collection</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                You expressly consent to AccrediPro's collection, storage, and use of the following data for purposes including fraud prevention, dispute resolution, service improvement, and legal compliance:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li><strong>IP Address:</strong> Your IP address at the time of purchase, account creation, and all subsequent platform access</li>
                <li><strong>Device Information:</strong> Browser type and version, operating system, screen resolution, device identifiers</li>
                <li><strong>Geographic Location:</strong> Approximate location based on IP geolocation</li>
                <li><strong>Timestamps:</strong> Exact date, time, and timezone of all account activities</li>
                <li><strong>Access Logs:</strong> Complete record of every login, page view, video play, and download</li>
                <li><strong>Engagement Metrics:</strong> Time spent on each page, video watch duration and completion percentage</li>
                <li><strong>Email Analytics:</strong> Email delivery confirmations, open rates, click-through data</li>
                <li><strong>Community Activity:</strong> Posts, comments, reactions, and all interactions</li>
                <li><strong>Support Interactions:</strong> Complete records of all support tickets and chat logs</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">7.2 Evidentiary Value</h3>
              <p className="text-gray-700 leading-relaxed">
                You agree that AccrediPro's server logs, database records, system-generated reports, and analytics data constitute prima facie evidence of delivery, access, usage, and engagement. You waive any objection to the authenticity, reliability, or admissibility of such electronic records in any legal, arbitration, or dispute resolution proceeding.
              </p>
            </section>

            {/* Article VIII - Representations */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <UserCheck className="w-6 h-6 text-burgundy-600" />
                Article VIII: Purchaser Representations and Warranties
              </h2>

              <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">8.1 Pre-Purchase Representations</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                By completing this purchase, you represent and warrant to AccrediPro that each of the following statements is true and accurate:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li><strong>Financial Capability:</strong> You have sufficient funds to complete this purchase without creating undue financial hardship.</li>
                <li><strong>Payment Authorization:</strong> You are the authorized user of the payment method being used.</li>
                <li><strong>Independent Decision:</strong> This purchase decision is yours alone, made freely and voluntarily.</li>
                <li><strong>Informed Decision:</strong> You have reviewed available information about the Digital Products.</li>
                <li><strong>Time Availability:</strong> You have or will make adequate time available to engage with the program.</li>
                <li><strong>Realistic Expectations:</strong> You understand that results depend primarily on your own effort and circumstances.</li>
                <li><strong>Technical Capability:</strong> You have reliable internet access and compatible devices.</li>
                <li><strong>Mental Capacity:</strong> You are making this decision with full mental capacity and clear understanding.</li>
                <li><strong>No Intent to Dispute:</strong> You are making this purchase in good faith with the intention of completing the program.</li>
              </ul>
            </section>

            {/* Article IX - IP */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Lock className="w-6 h-6 text-burgundy-600" />
                Article IX: Intellectual Property
              </h2>

              <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">9.1 Ownership</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                All Digital Products and associated materials are the exclusive intellectual property of AccrediPro LLC and its licensors, protected by United States and international copyright, trademark, trade secret, and intellectual property laws.
              </p>

              <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">9.2 Limited License</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Upon purchase, AccrediPro grants you a limited, non-exclusive, non-transferable, revocable license to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li>Access and view course materials for your personal educational purposes only</li>
                <li>Download provided resources for your personal reference and use</li>
                <li>Apply knowledge and skills learned in your personal or professional practice</li>
                <li>Reference your AccrediPro certification in professional credentials upon successful completion</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">9.3 Prohibited Activities</h3>
              <p className="text-gray-700 leading-relaxed mb-4">You may not, under any circumstances:</p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Record, screenshot, or duplicate video lectures or course content</li>
                <li>Share, distribute, or transfer course materials to any third party</li>
                <li>Upload course content to any public platform</li>
                <li>Sell, license, or monetize access to course materials</li>
                <li>Create derivative works based on our content</li>
                <li>Remove or alter any copyright notices or trademarks</li>
              </ul>
            </section>

            {/* Article X - Disclaimers */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <AlertTriangle className="w-6 h-6 text-burgundy-600" />
                Article X: Disclaimers and Limitations
              </h2>

              <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">10.1 Educational Purpose</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                AccrediPro Academy provides educational training for health and wellness coaches. Our programs are educational credentials only and do not constitute medical training, professional licensure, or authorization to diagnose, treat, prescribe, or provide medical advice.
              </p>

              <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">10.2 No Guarantee of Results</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                While we may reference earning potential, career opportunities, or client outcomes, AccrediPro makes no guarantee regarding your ability to attract clients, generate income, build a successful business, or achieve any particular results.
              </p>

              <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">10.3 Disclaimer of Warranties</h3>
              <p className="text-gray-700 leading-relaxed mb-4 uppercase font-medium text-sm">
                Digital Products are provided "AS IS" and "AS AVAILABLE" without warranties of any kind, either express or implied, including but not limited to implied warranties of merchantability, fitness for a particular purpose, title, and non-infringement.
              </p>

              <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">10.4 Limitation of Liability</h3>
              <p className="text-gray-700 leading-relaxed">
                To the maximum extent permitted by applicable law, AccrediPro's total liability to you for any claims arising from this Agreement shall not exceed the amount you paid for the specific product giving rise to the claim. In no event shall AccrediPro be liable for any indirect, incidental, special, consequential, punitive, or exemplary damages.
              </p>
            </section>

            {/* Article XI - Account */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Shield className="w-6 h-6 text-burgundy-600" />
                Article XI: Account and Termination
              </h2>

              <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">11.1 Account Security</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                You are solely responsible for maintaining the confidentiality of your login credentials and for all activities occurring under your account. Account sharing is strictly prohibited.
              </p>

              <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">11.2 Termination by AccrediPro</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                AccrediPro reserves the right to suspend or terminate your account and access to Digital Products, with or without notice, for:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Violation of any term of this Agreement</li>
                <li>Fraudulent, illegal, or abusive activity</li>
                <li>Intellectual property infringement or unauthorized distribution</li>
                <li>Harassment, abuse, or threats toward staff or other students</li>
                <li>Initiation of chargebacks or payment disputes</li>
                <li>Account sharing or unauthorized access provision</li>
              </ul>
            </section>

            {/* Article XII - Disputes */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Gavel className="w-6 h-6 text-burgundy-600" />
                Article XII: Dispute Resolution
              </h2>

              <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">12.1 Governing Law</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                This Agreement shall be governed by and construed in accordance with the laws of the State of Wyoming, United States, without regard to its conflict of law principles.
              </p>

              <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">12.2 Mandatory Arbitration</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Any controversy, claim, or dispute arising out of or relating to this Agreement shall be exclusively resolved through binding arbitration administered by the American Arbitration Association (AAA) under its Commercial Arbitration Rules. The arbitration shall be conducted in Sheridan, Wyoming, or via video conference at the Company's election.
              </p>

              <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">12.3 Class Action Waiver</h3>
              <p className="text-gray-700 leading-relaxed mb-4 font-medium">
                YOU AGREE THAT ANY ARBITRATION OR LEGAL PROCEEDING SHALL BE LIMITED TO THE DISPUTE BETWEEN ACCREDIPRO AND YOU INDIVIDUALLY. You hereby waive any right to participate in class action, collective action, mass action, representative action, or consolidated proceeding against AccrediPro.
              </p>

              <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">12.6 Statute of Limitations</h3>
              <p className="text-gray-700 leading-relaxed">
                Any claim or cause of action arising from this Agreement must be filed within one (1) year after such claim arose, or be forever barred.
              </p>
            </section>

            {/* Article XIII - General */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Globe className="w-6 h-6 text-burgundy-600" />
                Article XIII: General Provisions
              </h2>

              <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">13.1 Entire Agreement</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                This Agreement, together with our Privacy Policy and any supplemental terms for specific products, constitutes the entire agreement between you and AccrediPro concerning the subject matter hereof.
              </p>

              <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">13.2 Severability</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                If any provision of this Agreement is found to be invalid, such invalidity shall not affect the remaining provisions, which shall continue in full force and effect.
              </p>

              <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">13.10 Modifications</h3>
              <p className="text-gray-700 leading-relaxed">
                AccrediPro reserves the right to modify this Agreement at any time. Material changes will be communicated via email. Your continued use of Digital Products following notice of changes constitutes acceptance of the modified terms.
              </p>
            </section>

            {/* Contact Section */}
            <section className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Mail className="w-6 h-6 text-burgundy-600" />
                Contact Information
              </h2>
              <div className="bg-burgundy-50 rounded-xl p-6 border border-burgundy-100">
                <p className="text-gray-900 font-bold text-lg mb-3">AccrediPro LLC</p>
                <div className="space-y-2 text-gray-700">
                  <p>1309 Coffeen Avenue STE 1200</p>
                  <p>Sheridan, Wyoming 82801</p>
                  <p>United States</p>
                  <p className="pt-2">
                    <strong>Email:</strong>{" "}
                    <a href="mailto:info@accredipro.academy" className="text-burgundy-600 hover:underline font-medium">
                      info@accredipro.academy
                    </a>
                  </p>
                  <p>
                    <strong>Website:</strong>{" "}
                    <a href="https://learn.accredipro.academy" className="text-burgundy-600 hover:underline font-medium">
                      learn.accredipro.academy
                    </a>
                  </p>
                </div>
                <p className="text-gray-500 text-sm mt-4">
                  © AccrediPro LLC. All Rights Reserved.
                </p>
              </div>
            </section>

          </CardContent>
        </Card>

        {/* Related Links */}
        <div className="mt-8 flex flex-wrap gap-4 justify-center">
          <Link href="/privacy-policy">
            <Button variant="outline" className="border-burgundy-200 text-burgundy-700 hover:bg-burgundy-50">
              Privacy Policy
            </Button>
          </Link>
          <Link href="/refund-policy">
            <Button variant="outline" className="border-burgundy-200 text-burgundy-700 hover:bg-burgundy-50">
              Refund Policy
            </Button>
          </Link>
          <Link href="/code-of-ethics">
            <Button variant="outline" className="border-burgundy-200 text-burgundy-700 hover:bg-burgundy-50">
              Code of Ethics
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
