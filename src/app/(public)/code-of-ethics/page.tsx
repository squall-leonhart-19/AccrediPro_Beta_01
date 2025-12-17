import Link from "next/link";
import { Shield, Mail, Calendar, ArrowLeft, Heart, Star, Users, BookOpen, Award, Scale, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function CodeOfEthicsPage() {
  const lastUpdated = "December 15, 2024";

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
              <Heart className="w-6 h-6 text-gold-400" />
            </div>
            <Badge className="bg-gold-400/20 text-gold-300 border-gold-400/30">
              Our Standards
            </Badge>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Code of Ethics</h1>
          <p className="text-burgundy-100 text-lg mb-4">
            AccrediPro Academy is committed to the highest standards of ethical conduct, educational integrity, and professional responsibility.
          </p>
          <div className="flex items-center gap-2 text-burgundy-200 text-sm">
            <Calendar className="w-4 h-4" />
            Last Updated: {lastUpdated}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Mission Statement */}
        <div className="bg-gradient-to-r from-gold-50 to-amber-50 border-2 border-gold-200 rounded-xl p-6 mb-8">
          <div className="flex items-start gap-4">
            <Star className="w-6 h-6 text-gold-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-gold-800 mb-2">Our Core Values</h3>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-gold-100 text-gold-700">Excellence</Badge>
                <Badge className="bg-gold-100 text-gold-700">Integrity</Badge>
                <Badge className="bg-gold-100 text-gold-700">Respect</Badge>
                <Badge className="bg-gold-100 text-gold-700">Responsibility</Badge>
                <Badge className="bg-gold-100 text-gold-700">Innovation</Badge>
              </div>
            </div>
          </div>
        </div>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-8 md:p-12 prose prose-burgundy max-w-none">

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Star className="w-6 h-6 text-burgundy-600" />
                Our Mission & Values
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                AccrediPro Academy is committed to providing exceptional online education in health and wellness coaching while maintaining the highest standards of ethical conduct, educational integrity, and professional responsibility.
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li><strong>Excellence:</strong> Delivering world-class educational content and support</li>
                <li><strong>Integrity:</strong> Operating with honesty, transparency, and accountability</li>
                <li><strong>Respect:</strong> Valuing every student's unique journey and potential</li>
                <li><strong>Responsibility:</strong> Preparing coaches to practice safely and ethically</li>
                <li><strong>Innovation:</strong> Continuously improving our platform and curriculum</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Shield className="w-6 h-6 text-burgundy-600" />
                Our Commitment to You
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                As an online educational institution, AccrediPro Academy pledges to uphold the following principles:
              </p>

              <div className="grid md:grid-cols-2 gap-4 mt-6">
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                  <h3 className="font-bold text-gray-800 mb-2">Truth in Marketing</h3>
                  <p className="text-gray-600 text-sm">We provide accurate, honest representations of our courses, certifications, and earning potential. We never make misleading claims or guarantee specific outcomes.</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                  <h3 className="font-bold text-gray-800 mb-2">Quality Education</h3>
                  <p className="text-gray-600 text-sm">We maintain current, evidence-based curriculum developed by qualified professionals in health and wellness coaching.</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                  <h3 className="font-bold text-gray-800 mb-2">Student Support</h3>
                  <p className="text-gray-600 text-sm">We provide accessible, responsive support to help every student succeed in their educational journey.</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                  <h3 className="font-bold text-gray-800 mb-2">Fair Assessment</h3>
                  <p className="text-gray-600 text-sm">Our certification exams are designed to fairly evaluate competency and understanding of course material.</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                  <h3 className="font-bold text-gray-800 mb-2">Data Protection</h3>
                  <p className="text-gray-600 text-sm">We safeguard student privacy and handle personal information with the utmost care and compliance.</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                  <h3 className="font-bold text-gray-800 mb-2">Accessibility</h3>
                  <p className="text-gray-600 text-sm">We strive to make our content accessible to students with diverse backgrounds, learning styles, and needs.</p>
                </div>
              </div>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-burgundy-600" />
                Educational Integrity
              </h2>

              <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">Curriculum Development</h3>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li>Maintaining current, evidence-based educational content</li>
                <li>Regular review and updates by qualified subject matter experts</li>
                <li>Clear citation of sources and research supporting our curriculum</li>
                <li>Continuous improvement based on student feedback and industry developments</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">Accurate Representation</h3>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li>Course descriptions accurately reflect content and learning outcomes</li>
                <li>Certification credentials are clearly defined and honestly represented</li>
                <li>We distinguish between educational certifications and professional licensure</li>
                <li>We provide realistic information about career paths and earning potential</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">Academic Honesty</h3>
              <p className="text-gray-700 leading-relaxed">
                We expect and support academic integrity by clearly communicating expectations for honest work, implementing fair systems to detect and address dishonesty, and handling violations fairly while protecting the integrity of our certifications.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Users className="w-6 h-6 text-burgundy-600" />
                Student Respect & Dignity
              </h2>

              <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">Non-Discrimination</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                AccrediPro Academy does not discriminate on the basis of race, ethnicity, national origin, gender, gender identity, sexual orientation, religion, age, disability, health status, socioeconomic background, or geographic location.
              </p>

              <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">Safe Learning Environment</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                We are committed to maintaining a learning environment free from harassment, bullying, intimidation, hate speech, discriminatory language, sexual harassment, or any form of exploitation or abuse.
              </p>

              <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">Responsive Communication</h3>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Respond to student inquiries within 24-48 hours</li>
                <li>Provide clear, helpful guidance on academic and administrative matters</li>
                <li>Listen to and address student concerns with empathy and professionalism</li>
                <li>Maintain respectful, professional communication at all times</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Award className="w-6 h-6 text-burgundy-600" />
                Code of Ethics for Certified Coaches
              </h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                Upon certification, AccrediPro Academy graduates agree to uphold professional ethical standards in their coaching practice. This voluntary code reflects best practices in health and wellness coaching.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 bg-burgundy-50 rounded-xl border border-burgundy-100">
                  <CheckCircle className="w-5 h-5 text-burgundy-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">1. Professional Competence</h4>
                    <p className="text-gray-600 text-sm">Practice only within the scope of your training. Represent credentials honestly. Engage in ongoing learning to maintain skills.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-burgundy-50 rounded-xl border border-burgundy-100">
                  <CheckCircle className="w-5 h-5 text-burgundy-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">2. Client Welfare</h4>
                    <p className="text-gray-600 text-sm">Prioritize client wellbeing above business interests. Refer clients to healthcare professionals when needed. Never diagnose or prescribe.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-burgundy-50 rounded-xl border border-burgundy-100">
                  <CheckCircle className="w-5 h-5 text-burgundy-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">3. Professional Boundaries</h4>
                    <p className="text-gray-600 text-sm">Maintain appropriate professional boundaries. Avoid dual relationships that could impair judgment. Be mindful of power dynamics.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-burgundy-50 rounded-xl border border-burgundy-100">
                  <CheckCircle className="w-5 h-5 text-burgundy-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">4. Confidentiality & Privacy</h4>
                    <p className="text-gray-600 text-sm">Protect client confidentiality. Obtain informed consent before sharing information. Use secure systems for client data.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-burgundy-50 rounded-xl border border-burgundy-100">
                  <CheckCircle className="w-5 h-5 text-burgundy-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">5. Informed Consent</h4>
                    <p className="text-gray-600 text-sm">Clearly explain the nature, risks, and benefits of coaching. Ensure clients understand coaching is not therapy or medical treatment.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-burgundy-50 rounded-xl border border-burgundy-100">
                  <CheckCircle className="w-5 h-5 text-burgundy-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">6. Professional Integrity</h4>
                    <p className="text-gray-600 text-sm">Conduct business with honesty and fairness. Avoid conflicts of interest. Never exploit clients for personal, financial, or emotional gain.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-burgundy-50 rounded-xl border border-burgundy-100">
                  <CheckCircle className="w-5 h-5 text-burgundy-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">7. Cultural Competency</h4>
                    <p className="text-gray-600 text-sm">Respect clients' diverse backgrounds, beliefs, and values. Provide culturally sensitive services. Acknowledge your own biases.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-burgundy-50 rounded-xl border border-burgundy-100">
                  <CheckCircle className="w-5 h-5 text-burgundy-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">8. Professional Representation</h4>
                    <p className="text-gray-600 text-sm">Market services honestly without misleading claims. Do not guarantee specific outcomes. Conduct yourself in a manner that reflects well on the profession.</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Mail className="w-6 h-6 text-burgundy-600" />
                Questions or Concerns
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                If you have questions about our Code of Ethics or wish to report a concern, please contact us:
              </p>
              <div className="bg-burgundy-50 rounded-xl p-6 border border-burgundy-100">
                <p className="text-gray-900 font-semibold mb-2">AccrediPro Academy</p>
                <p className="text-gray-700">
                  Email: <a href="mailto:info@accredipro.academy" className="text-burgundy-600 hover:underline font-medium">info@accredipro.academy</a>
                </p>
                <p className="text-gray-700">
                  Website: <a href="https://accredipro.academy" className="text-burgundy-600 hover:underline font-medium">accredipro.academy</a>
                </p>
              </div>
            </section>

          </CardContent>
        </Card>

        {/* Related Links */}
        <div className="mt-8 flex flex-wrap gap-4 justify-center">
          <Link href="/terms-of-service">
            <Button variant="outline" className="border-burgundy-200 text-burgundy-700 hover:bg-burgundy-50">
              Terms of Service
            </Button>
          </Link>
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
        </div>
      </div>
    </div>
  );
}
