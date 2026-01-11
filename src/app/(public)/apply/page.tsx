"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  Shield,
  CheckCircle,
  MapPin,
  ArrowRight,
  Clock,
  Users,
  Award,
  Star,
  Loader2,
  ChevronRight,
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

const certificationOptions = [
  { value: "fm", label: "Functional Medicine Practitioner" },
  { value: "wh", label: "Women's Health Specialist" },
  { value: "gh", label: "Gut Health Specialist" },
  { value: "hn", label: "Holistic Nutrition Coach" },
  { value: "hc", label: "Certified Health Coach" },
  { value: "th", label: "Thyroid Health Specialist" },
  { value: "other", label: "Other / Not Sure Yet" },
];

const experienceLevels = [
  { value: "none", label: "No prior health education" },
  { value: "some", label: "Some health-related courses or self-study" },
  { value: "related", label: "Related degree or certification" },
  { value: "healthcare", label: "Currently working in healthcare" },
];

export default function ApplyPage() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    country: "",
    certification: "",
    experience: "",
    goals: "",
    timeline: "",
    heardFrom: "",
  });

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const updateForm = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: BRAND.cream }}>
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: BRAND.gold }}>
            <CheckCircle className="w-10 h-10" style={{ color: BRAND.burgundyDark }} />
          </div>
          <h1 className="text-3xl font-bold mb-4" style={{ color: BRAND.burgundy }}>Application Received!</h1>
          <p className="text-gray-600 mb-6">
            Thank you for applying to ASI. Our admissions team will review your application and reach out within 24-48 hours.
          </p>
          <p className="text-sm text-gray-500 mb-8">
            Check your email ({formData.email}) for a confirmation and next steps.
          </p>
          <Link href="/asi-home">
            <Button size="lg" className="font-bold hover:opacity-90" style={{ backgroundColor: BRAND.burgundy, color: "white" }}>
              Return to Homepage
            </Button>
          </Link>
        </div>
      </div>
    );
  }

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
              <Link href="/certifications" className="px-4 py-2 font-medium hover:opacity-70 transition-opacity" style={{ color: BRAND.burgundy }}>Certifications</Link>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost" style={{ color: BRAND.burgundy }}>Log In</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-12 md:py-16">
        <div className="grid lg:grid-cols-5 gap-12">
          {/* Form Section */}
          <div className="lg:col-span-3">
            <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ color: BRAND.burgundy }}>
              Apply for ASI Certification
            </h1>
            <p className="text-gray-600 mb-8">
              Complete this short application to get started. We'll reach out within 24-48 hours.
            </p>

            {/* Progress Steps */}
            <div className="flex items-center gap-2 mb-8">
              {[1, 2, 3].map(s => (
                <div key={s} className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${s <= step ? 'text-white' : 'text-gray-400 bg-gray-100'}`}
                    style={s <= step ? { backgroundColor: BRAND.burgundy } : {}}
                  >
                    {s < step ? <CheckCircle className="w-5 h-5" /> : s}
                  </div>
                  {s < 3 && <div className={`w-12 h-1 rounded ${s < step ? '' : 'bg-gray-200'}`} style={s < step ? { backgroundColor: BRAND.burgundy } : {}} />}
                </div>
              ))}
            </div>

            {/* Step 1: Basic Info */}
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold" style={{ color: BRAND.burgundy }}>Your Information</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => updateForm("firstName", e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-burgundy-500"
                      placeholder="Sarah"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => updateForm("lastName", e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-burgundy-500"
                      placeholder="Johnson"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateForm("email", e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-burgundy-500"
                    placeholder="sarah@example.com"
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => updateForm("phone", e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-burgundy-500"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Country *</label>
                    <select
                      value={formData.country}
                      onChange={(e) => updateForm("country", e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-burgundy-500"
                    >
                      <option value="">Select country...</option>
                      <option value="US">United States</option>
                      <option value="CA">Canada</option>
                      <option value="UK">United Kingdom</option>
                      <option value="AU">Australia</option>
                      <option value="AE">United Arab Emirates</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                <Button
                  onClick={() => setStep(2)}
                  disabled={!formData.firstName || !formData.lastName || !formData.email || !formData.country}
                  className="w-full py-4 h-auto font-bold text-lg hover:opacity-90 disabled:opacity-50"
                  style={{ backgroundColor: BRAND.burgundy, color: "white" }}
                >
                  Continue
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            )}

            {/* Step 2: Certification Selection */}
            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold" style={{ color: BRAND.burgundy }}>Your Certification Interest</h2>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Which certification interests you most? *</label>
                  <select
                    value={formData.certification}
                    onChange={(e) => updateForm("certification", e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-burgundy-500"
                  >
                    <option value="">Select certification...</option>
                    {certificationOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">What's your current experience level? *</label>
                  <select
                    value={formData.experience}
                    onChange={(e) => updateForm("experience", e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-burgundy-500"
                  >
                    <option value="">Select experience level...</option>
                    {experienceLevels.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">When do you hope to start?</label>
                  <select
                    value={formData.timeline}
                    onChange={(e) => updateForm("timeline", e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-burgundy-500"
                  >
                    <option value="">Select timeline...</option>
                    <option value="asap">As soon as possible</option>
                    <option value="1month">Within 1 month</option>
                    <option value="3months">Within 3 months</option>
                    <option value="exploring">Just exploring options</option>
                  </select>
                </div>
                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="flex-1 py-4 h-auto font-bold"
                    style={{ borderColor: BRAND.burgundy, color: BRAND.burgundy }}
                  >
                    Back
                  </Button>
                  <Button
                    onClick={() => setStep(3)}
                    disabled={!formData.certification || !formData.experience}
                    className="flex-1 py-4 h-auto font-bold text-lg hover:opacity-90 disabled:opacity-50"
                    style={{ backgroundColor: BRAND.burgundy, color: "white" }}
                  >
                    Continue
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Goals & Submit */}
            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold" style={{ color: BRAND.burgundy }}>Tell Us About Your Goals</h2>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">What are your career goals? (optional)</label>
                  <textarea
                    value={formData.goals}
                    onChange={(e) => updateForm("goals", e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-burgundy-500"
                    placeholder="Tell us what you hope to achieve with your certification..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">How did you hear about ASI?</label>
                  <select
                    value={formData.heardFrom}
                    onChange={(e) => updateForm("heardFrom", e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-burgundy-500"
                  >
                    <option value="">Select...</option>
                    <option value="google">Google search</option>
                    <option value="social">Social media</option>
                    <option value="referral">Friend or colleague</option>
                    <option value="podcast">Podcast</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-600">
                  <p>
                    By submitting this application, you agree to receive communications from ASI about your application and relevant programs. You can unsubscribe at any time.
                  </p>
                </div>
                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    onClick={() => setStep(2)}
                    className="flex-1 py-4 h-auto font-bold"
                    style={{ borderColor: BRAND.burgundy, color: BRAND.burgundy }}
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="flex-1 py-4 h-auto font-bold text-lg hover:opacity-90 disabled:opacity-50"
                    style={{ backgroundColor: BRAND.burgundy, color: "white" }}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        Submit Application
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-2">
            <div className="sticky top-24 space-y-6">
              {/* Why ASI Card */}
              <div className="bg-gradient-to-br from-burgundy-50 to-white rounded-2xl p-6 border border-gray-100">
                <h3 className="text-lg font-bold mb-4" style={{ color: BRAND.burgundy }}>Why Choose ASI?</h3>
                <ul className="space-y-3">
                  {[
                    { icon: Award, text: "Competency-based certification" },
                    { icon: Users, text: "20,000+ certified practitioners" },
                    { icon: Star, text: "4.9/5 student satisfaction" },
                    { icon: Clock, text: "Flexible, self-paced learning" },
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${BRAND.gold}20` }}>
                        <item.icon className="w-4 h-4" style={{ color: BRAND.gold }} />
                      </div>
                      <span className="text-gray-700">{item.text}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Testimonial */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4" style={{ color: BRAND.gold, fill: BRAND.gold }} />
                  ))}
                </div>
                <p className="text-gray-600 italic mb-4">
                  "The application process was simple and the admissions team was incredibly helpful. Within 3 months of completing my certification, I had my first paying clients."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm" style={{ backgroundColor: `${BRAND.burgundy}10`, color: BRAND.burgundy }}>
                    JM
                  </div>
                  <div>
                    <p className="font-semibold text-sm" style={{ color: BRAND.burgundy }}>Jennifer M.</p>
                    <p className="text-xs text-gray-500">Functional Medicine Practitioner</p>
                  </div>
                </div>
              </div>

              {/* Contact */}
              <div className="text-center text-sm text-gray-500">
                <p>Questions? Email us at</p>
                <a href="mailto:admissions@asi.edu" className="font-semibold hover:underline" style={{ color: BRAND.burgundy }}>
                  admissions@asi.edu
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
