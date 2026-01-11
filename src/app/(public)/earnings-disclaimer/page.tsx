import Link from "next/link";
import Image from "next/image";
import {
  DollarSign,
  Mail,
  Calendar,
  AlertTriangle,
  TrendingUp,
  Target,
  Clock,
  Users,
  Briefcase,
  BarChart3,
  Scale,
  FileWarning,
  UserX,
  Building2,
  Lightbulb,
  Heart,
  GraduationCap,
  Shield,
  MapPin,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: "Earnings Disclaimer | Accreditation Standards Institute",
  description: "Important FTC-compliant earnings disclaimer for ASI certifications. Results vary. No income guarantees. Read before enrolling.",
};

// Brand Colors from logo
const BRAND = {
  burgundy: "#722f37",
  burgundyDark: "#4e1f24",
  gold: "#d4af37",
  goldLight: "#e8c547",
  cream: "#fdf8f0",
};

export default function EarningsDisclaimerPage() {
  const lastUpdated = "January 1, 2025";

  return (
    <div className="min-h-screen bg-white">
      {/* Top Bar */}
      <div style={{ backgroundColor: BRAND.burgundyDark }} className="text-white py-2 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-sm">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2">
              <MapPin className="w-3 h-3" style={{ color: BRAND.gold }} />
              USA Headquarters
            </span>
            <span className="flex items-center gap-2">
              <MapPin className="w-3 h-3" style={{ color: BRAND.gold }} />
              Dubai Office
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/verify" className="hover:opacity-80 transition-opacity" style={{ color: BRAND.gold }}>
              Verify Credential
            </Link>
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
              <div className="relative group">
                <Link href="/about" className="px-4 py-2 font-medium hover:opacity-70 transition-opacity flex items-center gap-1" style={{ color: BRAND.burgundy }}>
                  About <ChevronRight className="w-4 h-4 rotate-90" />
                </Link>
              </div>
              <div className="relative group">
                <Link href="/standards" className="px-4 py-2 font-medium hover:opacity-70 transition-opacity flex items-center gap-1" style={{ color: BRAND.burgundy }}>
                  Standards <ChevronRight className="w-4 h-4 rotate-90" />
                </Link>
              </div>
              <div className="relative group">
                <Link href="/certifications" className="px-4 py-2 font-medium hover:opacity-70 transition-opacity flex items-center gap-1" style={{ color: BRAND.burgundy }}>
                  Certifications <ChevronRight className="w-4 h-4 rotate-90" />
                </Link>
              </div>
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

      {/* Hero Header */}
      <div className="text-white" style={{ backgroundColor: BRAND.burgundyDark }}>
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="flex items-center gap-3 mb-6">
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: `${BRAND.gold}20`, border: `1px solid ${BRAND.gold}40` }}
            >
              <DollarSign className="w-7 h-7" style={{ color: BRAND.gold }} />
            </div>
            <Badge
              className="text-sm font-semibold px-4 py-1.5"
              style={{ backgroundColor: `${BRAND.gold}20`, color: BRAND.gold, border: `1px solid ${BRAND.gold}40` }}
            >
              Legal Document
            </Badge>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Earnings Disclaimer</h1>
          <p className="text-xl mb-6" style={{ color: "#f5e6e8" }}>
            Important information about income expectations and financial disclosures. Please read this entire document before enrolling in any ASI program.
          </p>
          <div className="flex items-center gap-2 text-sm" style={{ color: "#f5e6e8" }}>
            <Calendar className="w-4 h-4" />
            Last Updated: {lastUpdated}
          </div>
        </div>
      </div>

      {/* Critical Warning Box */}
      <div className="max-w-4xl mx-auto px-4 -mt-6">
        <div
          className="rounded-xl p-6 border-2"
          style={{ backgroundColor: "#fef2f2", borderColor: "#fca5a5" }}
        >
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            <div>
              <h3 className="font-bold text-red-800 text-xl mb-2">
                NO INCOME GUARANTEES - PLEASE READ CAREFULLY
              </h3>
              <p className="text-red-700 leading-relaxed mb-3">
                The Accreditation Standards Institute (ASI) makes <strong>NO GUARANTEES</strong> regarding income, earnings, or financial success. Any income examples, testimonials, or success stories shared on our website, social media, emails, or marketing materials represent <strong>EXCEPTIONAL RESULTS</strong> and are not typical. Your results will vary and may be significantly less than the examples shown.
              </p>
              <p className="text-red-700 leading-relaxed font-semibold">
                The average person who purchases educational courses gets little to no financial results. Many students do not complete their training or take meaningful action.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Card className="border-0 shadow-xl">
          <CardContent className="p-8 md:p-12 prose prose-lg max-w-none">

            {/* Section 1: No Earnings Guarantees */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-3" style={{ color: BRAND.burgundy }}>
                <Target className="w-6 h-6 flex-shrink-0" />
                1. No Earnings Guarantees (FTC Compliance)
              </h2>
              <div className="rounded-xl p-6 mb-6" style={{ backgroundColor: BRAND.cream }}>
                <p className="text-gray-700 leading-relaxed mb-4">
                  In accordance with the Federal Trade Commission (FTC) guidelines regarding income claims and endorsements, the Accreditation Standards Institute provides this disclosure:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li><strong>Results are NOT typical.</strong> Your results WILL vary.</li>
                  <li>We make <strong>NO PROMISES</strong> that you will earn any specific amount of money.</li>
                  <li>We make <strong>NO GUARANTEES</strong> that you will achieve similar results to any testimonials shown.</li>
                  <li>Earning money as a health coach or wellness practitioner requires <strong>significant effort, skill, and business acumen</strong> that goes far beyond completing a certification.</li>
                  <li>There is <strong>NO GUARANTEE</strong> that you will make any money at all using our training or credentials.</li>
                </ul>
              </div>
            </section>

            {/* Section 2: Income Testimonials */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-3" style={{ color: BRAND.burgundy }}>
                <Users className="w-6 h-6 flex-shrink-0" />
                2. Income Testimonials and Examples
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Any income testimonials, success stories, or earnings examples displayed on our website, social media, advertisements, or marketing materials are provided for illustrative purposes only. When we share such examples:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li>They represent <strong>exceptional results achieved by specific individuals</strong> in their unique circumstances</li>
                <li>These individuals may have had advantages such as prior business experience, existing networks, financial resources, or professional backgrounds that contributed to their success</li>
                <li>Their results are <strong>NOT typical</strong> and should not be expected by the average student</li>
                <li>We cannot verify or substantiate all claimed income figures</li>
                <li>Some testimonial providers may have received compensation, discounts, or other incentives</li>
                <li>Income figures shown are typically <strong>gross revenue</strong>, not net profit, and do not account for business expenses, taxes, or other costs</li>
              </ul>
            </section>

            {/* Section 3: Typical Results */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-3" style={{ color: BRAND.burgundy }}>
                <BarChart3 className="w-6 h-6 flex-shrink-0" />
                3. Typical Results Disclosure
              </h2>
              <div className="rounded-xl p-6 border-2 mb-6" style={{ backgroundColor: "#fffbeb", borderColor: "#fbbf24" }}>
                <p className="text-amber-800 font-bold text-lg mb-3">HONEST DISCLOSURE ABOUT TYPICAL OUTCOMES:</p>
                <ul className="list-disc pl-6 text-amber-800 space-y-2">
                  <li><strong>Most students who purchase educational programs do NOT earn significant income from them.</strong></li>
                  <li>Many students never complete their certification or training.</li>
                  <li>Of those who complete, many never take action to start a business or find clients.</li>
                  <li>Of those who start a business, many earn little to no money in their first year.</li>
                  <li>Building a successful coaching practice typically takes <strong>years of consistent effort</strong>, not weeks or months.</li>
                  <li>The majority of health coaching businesses fail within the first few years, similar to other small businesses.</li>
                </ul>
              </div>
              <p className="text-gray-700 leading-relaxed">
                We want you to enter our programs with realistic expectations. Certification is the <strong>beginning</strong> of your journey, not a guarantee of success.
              </p>
            </section>

            {/* Section 4: Factors Affecting Success */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-3" style={{ color: BRAND.burgundy }}>
                <TrendingUp className="w-6 h-6 flex-shrink-0" />
                4. Factors That Affect Your Success
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Your success as a health and wellness practitioner depends on numerous factors that are unique to you and largely outside our control:
              </p>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="rounded-lg p-4" style={{ backgroundColor: BRAND.cream }}>
                  <h4 className="font-bold mb-2" style={{ color: BRAND.burgundy }}>Personal Factors</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>Your work ethic and consistency</li>
                    <li>Your existing skills and experience</li>
                    <li>Your educational background</li>
                    <li>Your communication abilities</li>
                    <li>Your personal brand and reputation</li>
                    <li>Your ability to handle rejection</li>
                    <li>Your persistence and resilience</li>
                  </ul>
                </div>
                <div className="rounded-lg p-4" style={{ backgroundColor: BRAND.cream }}>
                  <h4 className="font-bold mb-2" style={{ color: BRAND.burgundy }}>Business Factors</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>Your marketing and sales skills</li>
                    <li>Your ability to attract clients</li>
                    <li>Your pricing strategy</li>
                    <li>Your business management abilities</li>
                    <li>Your financial resources for startup</li>
                    <li>Your technology proficiency</li>
                    <li>Your customer service skills</li>
                  </ul>
                </div>
                <div className="rounded-lg p-4" style={{ backgroundColor: BRAND.cream }}>
                  <h4 className="font-bold mb-2" style={{ color: BRAND.burgundy }}>External Factors</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>Your local market conditions</li>
                    <li>Competition in your area</li>
                    <li>Economic conditions</li>
                    <li>Consumer demand for services</li>
                    <li>Regulatory environment</li>
                    <li>Industry trends</li>
                    <li>Global events and disruptions</li>
                  </ul>
                </div>
                <div className="rounded-lg p-4" style={{ backgroundColor: BRAND.cream }}>
                  <h4 className="font-bold mb-2" style={{ color: BRAND.burgundy }}>Time Investment</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>Hours you can dedicate weekly</li>
                    <li>Part-time vs. full-time commitment</li>
                    <li>Other life responsibilities</li>
                    <li>Your learning speed</li>
                    <li>Time to market yourself</li>
                    <li>Client session availability</li>
                    <li>Long-term commitment level</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 5: No Get-Rich-Quick */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-3" style={{ color: BRAND.burgundy }}>
                <FileWarning className="w-6 h-6 flex-shrink-0" />
                5. This Is NOT a Get-Rich-Quick Opportunity
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                ASI certification programs are <strong>professional education courses</strong>, not income opportunities, investment vehicles, or get-rich-quick schemes. We want to be absolutely clear:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li>There are <strong>no shortcuts</strong> to building a successful practice</li>
                <li>Success requires <strong>months or years</strong> of consistent effort, not days or weeks</li>
                <li>You will NOT earn money simply by completing a certification</li>
                <li>Credentials alone do NOT attract clients - marketing, networking, and relationship-building do</li>
                <li>Any claims suggesting otherwise are false and not endorsed by ASI</li>
              </ul>
              <div className="rounded-xl p-6 border-2" style={{ borderColor: BRAND.burgundy, backgroundColor: `${BRAND.burgundy}05` }}>
                <p className="text-gray-800 font-medium">
                  If anyone has told you that ASI certification is a quick or easy path to wealth, they have misrepresented our programs. Building a health coaching practice is <strong>hard work</strong> that requires dedication, skill development, and ongoing effort over an extended period.
                </p>
              </div>
            </section>

            {/* Section 6: Educational Investment */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-3" style={{ color: BRAND.burgundy }}>
                <GraduationCap className="w-6 h-6 flex-shrink-0" />
                6. Educational Investment, Not Business Opportunity
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                The Accreditation Standards Institute is an educational institution. When you enroll in our programs, you are investing in your <strong>education and professional development</strong>. You are NOT:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li>Purchasing a business opportunity or franchise</li>
                <li>Joining a multi-level marketing (MLM) company</li>
                <li>Buying into an income-generating system</li>
                <li>Receiving guaranteed employment or clients</li>
                <li>Acquiring a ready-made business</li>
                <li>Investing in a passive income stream</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                Our programs provide <strong>education, training, and credentials</strong>. What you do with that education - and whether you succeed financially - depends entirely on your own actions, decisions, and circumstances after completing your training.
              </p>
            </section>

            {/* Section 7: Your Results Depend on You */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-3" style={{ color: BRAND.burgundy }}>
                <Lightbulb className="w-6 h-6 flex-shrink-0" />
                7. Your Results Depend Entirely on You
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We provide the education and credentials. <strong>You</strong> must provide everything else:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li>The initiative to complete your training</li>
                <li>The motivation to apply what you learn</li>
                <li>The courage to start your business or seek employment</li>
                <li>The persistence to market yourself consistently</li>
                <li>The skills to convert prospects into clients</li>
                <li>The ability to deliver excellent service</li>
                <li>The business acumen to manage finances, operations, and growth</li>
                <li>The resilience to overcome inevitable setbacks</li>
              </ul>
              <p className="text-gray-700 leading-relaxed font-medium">
                No amount of education, support, or encouragement from ASI can substitute for your own effort and ability.
              </p>
            </section>

            {/* Section 8: Market and Economic Factors */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-3" style={{ color: BRAND.burgundy }}>
                <Building2 className="w-6 h-6 flex-shrink-0" />
                8. Market and Economic Factors
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                The health and wellness industry is subject to market forces and economic conditions that we cannot predict or control:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li>Consumer spending on wellness services fluctuates with economic conditions</li>
                <li>Competition in the health coaching space is increasing rapidly</li>
                <li>Market saturation varies significantly by geographic area and specialty</li>
                <li>Regulatory changes may affect what services you can legally provide</li>
                <li>Technology disruptions may change how services are delivered</li>
                <li>Global events (pandemics, recessions, etc.) can dramatically impact demand</li>
                <li>Insurance coverage for coaching services remains limited</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                These factors may positively or negatively affect your ability to build a successful practice, regardless of the quality of your training.
              </p>
            </section>

            {/* Section 9: Time and Effort Required */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-3" style={{ color: BRAND.burgundy }}>
                <Clock className="w-6 h-6 flex-shrink-0" />
                9. Realistic Time and Effort Expectations
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Building a sustainable health coaching practice typically requires:
              </p>
              <div className="rounded-xl p-6 mb-4" style={{ backgroundColor: BRAND.cream }}>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-3">
                    <span className="font-bold min-w-[80px]" style={{ color: BRAND.burgundy }}>Year 1:</span>
                    <span>Completing training, obtaining credentials, building foundation, possibly earning little to no income while learning and establishing yourself</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="font-bold min-w-[80px]" style={{ color: BRAND.burgundy }}>Years 2-3:</span>
                    <span>Developing your client base, refining your offerings, building reputation, possibly achieving modest supplemental income</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="font-bold min-w-[80px]" style={{ color: BRAND.burgundy }}>Years 3-5:</span>
                    <span>Potential for meaningful income IF you have consistently marketed, delivered excellent service, and built referral networks</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="font-bold min-w-[80px]" style={{ color: BRAND.burgundy }}>Beyond:</span>
                    <span>Continued growth requires ongoing effort, skill development, and adaptation to market changes</span>
                  </li>
                </ul>
              </div>
              <p className="text-gray-700 leading-relaxed font-medium">
                Anyone suggesting you can build a six-figure practice in weeks or months is being unrealistic. Most successful practitioners have invested years into their development.
              </p>
            </section>

            {/* Section 10: Professional Development vs Income */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-3" style={{ color: BRAND.burgundy }}>
                <Heart className="w-6 h-6 flex-shrink-0" />
                10. Professional Development vs. Income Expectations
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Our primary purpose is to provide high-quality professional education that helps you become a competent, ethical practitioner. While career advancement and income potential may be factors in your decision to enroll, we encourage you to value:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li>The knowledge and skills you will gain</li>
                <li>Your ability to help others improve their health</li>
                <li>Personal growth and professional development</li>
                <li>Credentials that demonstrate your commitment to the field</li>
                <li>Being part of a community of health professionals</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                If your <strong>only</strong> motivation is to make money, you may be disappointed. The most successful practitioners are those who are genuinely passionate about helping others and view income as a byproduct of excellent service.
              </p>
            </section>

            {/* Section 11: Forward-Looking Statements */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-3" style={{ color: BRAND.burgundy }}>
                <Scale className="w-6 h-6 flex-shrink-0" />
                11. Forward-Looking Statements
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Any statements we make about potential outcomes, future results, or expected benefits are <strong>forward-looking statements</strong> that involve risks and uncertainties. Such statements:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li>Are based on current expectations and assumptions</li>
                <li>Are not guarantees of future performance</li>
                <li>May prove to be inaccurate</li>
                <li>Should not be relied upon as predictions</li>
                <li>Are subject to change without notice</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                Actual results may differ materially from any forward-looking statements due to various factors including market conditions, economic changes, and individual circumstances.
              </p>
            </section>

            {/* Section 12: Individual Circumstances */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-3" style={{ color: BRAND.burgundy }}>
                <UserX className="w-6 h-6 flex-shrink-0" />
                12. Your Individual Circumstances
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Before enrolling, carefully consider your individual circumstances:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li><strong>Financial situation:</strong> Can you afford the tuition without causing financial hardship?</li>
                <li><strong>Time availability:</strong> Do you have sufficient time to complete the training AND build a practice?</li>
                <li><strong>Current obligations:</strong> How will this fit with your family, work, and other responsibilities?</li>
                <li><strong>Realistic expectations:</strong> Are you prepared for the possibility of limited or no financial return?</li>
                <li><strong>Backup plan:</strong> What will you do if your coaching practice doesn't succeed?</li>
                <li><strong>Support system:</strong> Do you have people who will support your journey?</li>
              </ul>
              <p className="text-gray-700 leading-relaxed font-medium">
                We encourage you to discuss this decision with family members, financial advisors, or mentors before enrolling.
              </p>
            </section>

            {/* Section 13: No Guarantees of Clients */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-3" style={{ color: BRAND.burgundy }}>
                <Briefcase className="w-6 h-6 flex-shrink-0" />
                13. No Guarantees of Clients or Business Success
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                ASI does NOT guarantee:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li>That you will acquire any clients</li>
                <li>That you will find employment in the health coaching field</li>
                <li>That employers will recognize or value your credential</li>
                <li>That your practice will be profitable</li>
                <li>That you will recoup your educational investment</li>
                <li>That the credential will lead to any specific opportunities</li>
                <li>That our career support services will result in clients or jobs</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                While we provide directory listings, networking opportunities, and career resources, these are <strong>tools and resources</strong> - not guarantees. Their effectiveness depends entirely on how you use them and external market factors.
              </p>
            </section>

            {/* Section 14: Acknowledgment */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-3" style={{ color: BRAND.burgundy }}>
                <Shield className="w-6 h-6 flex-shrink-0" />
                14. Your Acknowledgment
              </h2>
              <div className="rounded-xl p-6 border-2" style={{ borderColor: BRAND.burgundy, backgroundColor: `${BRAND.burgundy}05` }}>
                <p className="text-gray-800 leading-relaxed mb-4">
                  By enrolling in any ASI program, you acknowledge and agree that:
                </p>
                <ul className="list-disc pl-6 text-gray-800 space-y-2 mb-4">
                  <li>You have read and understood this entire Earnings Disclaimer</li>
                  <li>You understand that results are NOT guaranteed and will vary significantly</li>
                  <li>You are enrolling for educational purposes, not as an income opportunity</li>
                  <li>You accept full responsibility for your own success or failure</li>
                  <li>You will not hold ASI liable for your financial outcomes</li>
                  <li>You have made this decision after careful consideration of your circumstances</li>
                  <li>You have realistic expectations about the time and effort required</li>
                  <li>You understand that most people do not earn significant income from educational courses</li>
                </ul>
                <p className="text-gray-800 font-semibold">
                  If you do not agree with any part of this disclaimer, please do not enroll in our programs.
                </p>
              </div>
            </section>

            {/* Contact */}
            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-3" style={{ color: BRAND.burgundy }}>
                <Mail className="w-6 h-6 flex-shrink-0" />
                Questions About This Disclaimer?
              </h2>
              <div className="rounded-xl p-6" style={{ backgroundColor: BRAND.cream }}>
                <p className="font-semibold mb-2" style={{ color: BRAND.burgundy }}>Accreditation Standards Institute</p>
                <p className="text-gray-700 mb-1">
                  Email: <a href="mailto:legal@accreditationstandards.org" className="font-medium hover:underline" style={{ color: BRAND.burgundy }}>legal@accreditationstandards.org</a>
                </p>
                <p className="text-gray-700">
                  Website: <a href="https://accreditationstandards.org" className="font-medium hover:underline" style={{ color: BRAND.burgundy }}>accreditationstandards.org</a>
                </p>
                <p className="text-sm text-gray-500 mt-4">
                  We encourage you to contact us if you have any questions about this disclaimer before enrolling.
                </p>
              </div>
            </section>

          </CardContent>
        </Card>

        {/* Related Links */}
        <div className="mt-8 flex flex-wrap gap-4 justify-center">
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
          <Link href="/refund-policy">
            <Button variant="outline" style={{ borderColor: BRAND.burgundy, color: BRAND.burgundy }}>
              Refund Policy
            </Button>
          </Link>
          <Link href="/health-disclaimer">
            <Button variant="outline" style={{ borderColor: BRAND.burgundy, color: BRAND.burgundy }}>
              Health Disclaimer
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-white py-16" style={{ backgroundColor: BRAND.burgundyDark }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-5 gap-8 mb-12">
            {/* Logo & Info */}
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
                Setting standards. Building careers.
              </p>
              <div className="space-y-2 text-sm" style={{ color: "#f5e6e8" }}>
                <p className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" style={{ color: BRAND.gold }} />
                  USA Headquarters
                </p>
                <p className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" style={{ color: BRAND.gold }} />
                  Dubai Office
                </p>
              </div>
            </div>

            {/* Links */}
            <div>
              <h4 className="font-bold mb-4" style={{ color: BRAND.gold }}>Certifications</h4>
              <ul className="space-y-2 text-sm" style={{ color: "#f5e6e8" }}>
                <li><Link href="/certifications" className="hover:text-white transition-colors">All Certifications</Link></li>
                <li><Link href="/certifications/functional-medicine" className="hover:text-white transition-colors">Functional Medicine</Link></li>
                <li><Link href="/certifications/womens-health" className="hover:text-white transition-colors">Women's Health</Link></li>
                <li><Link href="/certifications/gut-health" className="hover:text-white transition-colors">Gut Health</Link></li>
                <li><Link href="/certifications/nutrition" className="hover:text-white transition-colors">Nutrition</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4" style={{ color: BRAND.gold }}>Company</h4>
              <ul className="space-y-2 text-sm" style={{ color: "#f5e6e8" }}>
                <li><Link href="/about" className="hover:text-white transition-colors">About ASI</Link></li>
                <li><Link href="/standards" className="hover:text-white transition-colors">Our Standards</Link></li>
                <li><Link href="/leadership" className="hover:text-white transition-colors">Leadership</Link></li>
                <li><Link href="/code-of-ethics" className="hover:text-white transition-colors">Code of Ethics</Link></li>
                <li><Link href="/careers-at-asi" className="hover:text-white transition-colors">Careers at ASI</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4" style={{ color: BRAND.gold }}>Legal</h4>
              <ul className="space-y-2 text-sm" style={{ color: "#f5e6e8" }}>
                <li><Link href="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/refund-policy" className="hover:text-white transition-colors">Refund Policy</Link></li>
                <li><Link href="/earnings-disclaimer" className="hover:text-white transition-colors">Earnings Disclaimer</Link></li>
                <li><Link href="/health-disclaimer" className="hover:text-white transition-colors">Health Disclaimer</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4" style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}>
            <p className="text-sm" style={{ color: "#f5e6e8" }}>
              © 2025 Accreditation Standards Institute. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm" style={{ color: "#f5e6e8" }}>
              <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link>
              <Link href="/refund-policy" className="hover:text-white transition-colors">Refund Policy</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
