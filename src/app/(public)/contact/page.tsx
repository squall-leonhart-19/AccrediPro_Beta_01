import Link from "next/link";
import { PublicLayout } from "@/components/public/public-layout";
import { Button } from "@/components/ui/button";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  MessageSquare,
  Send,
  Globe,
  Building,
  Users,
  FileText,
  HelpCircle,
  ArrowRight,
} from "lucide-react";

export const metadata = {
  title: "Contact Us | AccrediPro Standards Institute",
  description: "Get in touch with AccrediPro Standards Institute. Questions about certification, enrollment, or partnership opportunities? We're here to help.",
  openGraph: {
    title: "Contact AccrediPro Standards Institute",
    description: "Questions about certification? We're here to help.",
  },
};

const contactMethods = [
  {
    icon: Mail,
    title: "Email Us",
    description: "For general inquiries and support",
    value: "info@accredipro.academy",
    href: "mailto:info@accredipro.academy",
    action: "Send Email",
  },
  {
    icon: MessageSquare,
    title: "Live Chat",
    description: "Chat with our team in real-time",
    value: "Available Mon-Fri 9AM-6PM EST",
    href: "#chat",
    action: "Start Chat",
  },
  {
    icon: Phone,
    title: "Schedule a Call",
    description: "Book a consultation with admissions",
    value: "30-minute discovery call",
    href: "https://calendly.com/accredipro",
    action: "Book Call",
  },
];

const departments = [
  {
    name: "Student Admissions",
    email: "admissions@accredipro.academy",
    description: "Questions about enrollment, programs, and getting started",
  },
  {
    name: "Student Support",
    email: "support@accredipro.academy",
    description: "Help with your courses, account, and technical issues",
  },
  {
    name: "Certification Office",
    email: "certification@accredipro.academy",
    description: "Exam scheduling, credentials, and verification",
  },
  {
    name: "Partnership Inquiries",
    email: "partners@accredipro.academy",
    description: "Corporate training, affiliates, and collaborations",
  },
];

const faqs = [
  {
    question: "How long does certification take?",
    answer: "Foundation Certificate takes 4-6 weeks. Professional Certification takes 3-6 months. Board Certification takes 6-12 months.",
  },
  {
    question: "Is the certification recognized internationally?",
    answer: "Yes! ASI holds 9 international accreditations including CPD, IPHM, and CMA. Our graduates practice in 50+ countries.",
  },
  {
    question: "Can I get insurance with your certification?",
    answer: "Professional (CP™) and Board Certified (BC-™) credentials qualify for professional liability insurance in most jurisdictions.",
  },
  {
    question: "What payment plans are available?",
    answer: "We offer flexible payment plans on all programs. Contact admissions for details on monthly payment options.",
  },
];

export default function ContactPage() {
  return (
    <PublicLayout>
      {/* Hero */}
      <section className="relative py-20 lg:py-28 bg-gradient-to-br from-burgundy-900 via-burgundy-800 to-burgundy-900 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-gold-400 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-5xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Get in <span className="text-gold-400">Touch</span>
          </h1>
          <p className="text-xl text-burgundy-100 max-w-3xl mx-auto mb-8 leading-relaxed">
            Questions about certification, enrollment, or partnerships?
            Our team is here to help you take the next step in your professional journey.
          </p>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {contactMethods.map((method, i) => (
              <div
                key={i}
                className="bg-gray-50 rounded-2xl p-8 text-center hover:shadow-lg transition-shadow"
              >
                <div className="w-16 h-16 bg-burgundy-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <method.icon className="w-8 h-8 text-burgundy-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{method.title}</h3>
                <p className="text-gray-500 text-sm mb-4">{method.description}</p>
                <p className="text-gray-700 font-medium mb-6">{method.value}</p>
                <a href={method.href}>
                  <Button className="w-full bg-burgundy-600 hover:bg-burgundy-700">
                    {method.action}
                  </Button>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form + Departments */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Form */}
            <div className="bg-white rounded-2xl p-8 lg:p-10 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Send Us a Message</h2>
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-burgundy-500 focus:border-burgundy-500 outline-none transition"
                      placeholder="Your first name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-burgundy-500 focus:border-burgundy-500 outline-none transition"
                      placeholder="Your last name"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-burgundy-500 focus:border-burgundy-500 outline-none transition"
                    placeholder="you@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <select className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-burgundy-500 focus:border-burgundy-500 outline-none transition">
                    <option>Enrollment Question</option>
                    <option>Certification Inquiry</option>
                    <option>Technical Support</option>
                    <option>Partnership Opportunity</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    rows={5}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-burgundy-500 focus:border-burgundy-500 outline-none transition resize-none"
                    placeholder="How can we help you?"
                  />
                </div>
                <Button type="submit" className="w-full bg-burgundy-600 hover:bg-burgundy-700" size="lg">
                  Send Message <Send className="w-4 h-4 ml-2" />
                </Button>
              </form>
            </div>

            {/* Departments */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Departments</h2>
              <div className="space-y-4">
                {departments.map((dept, i) => (
                  <div key={i} className="bg-white rounded-xl p-6 shadow-sm">
                    <h3 className="font-bold text-gray-900 mb-1">{dept.name}</h3>
                    <p className="text-gray-500 text-sm mb-3">{dept.description}</p>
                    <a
                      href={`mailto:${dept.email}`}
                      className="inline-flex items-center gap-2 text-burgundy-600 hover:text-burgundy-700 font-medium text-sm"
                    >
                      <Mail className="w-4 h-4" />
                      {dept.email}
                    </a>
                  </div>
                ))}
              </div>

              {/* Business Hours */}
              <div className="mt-8 bg-burgundy-50 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Clock className="w-5 h-5 text-burgundy-600" />
                  <h3 className="font-bold text-gray-900">Business Hours</h3>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Monday - Friday</span>
                    <span className="font-medium">9:00 AM - 6:00 PM EST</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday</span>
                    <span className="font-medium">10:00 AM - 2:00 PM EST</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday</span>
                    <span className="font-medium text-gray-400">Closed</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-4">
                  Response time: Within 24-48 business hours
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-burgundy-600 font-semibold uppercase tracking-wider text-sm">
              Quick Answers
            </span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-bold text-gray-900 mb-2 flex items-start gap-3">
                  <HelpCircle className="w-5 h-5 text-burgundy-500 mt-0.5 flex-shrink-0" />
                  {faq.question}
                </h3>
                <p className="text-gray-600 ml-8">{faq.answer}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/how-it-works">
              <Button variant="outline">
                Learn More About Certification <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Map / Location */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl font-bold mb-4">Global Headquarters</h2>
              <div className="space-y-4 text-gray-300">
                <div className="flex items-start gap-3">
                  <Building className="w-5 h-5 text-gold-400 mt-1" />
                  <div>
                    <p className="font-medium text-white">AccrediPro Standards Institute</p>
                    <p>International Headquarters</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Globe className="w-5 h-5 text-gold-400 mt-1" />
                  <div>
                    <p>Serving students in 50+ countries</p>
                    <p>100% online certification programs</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-800 rounded-2xl p-8 text-center">
              <Globe className="w-16 h-16 text-gold-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Global Online Academy</h3>
              <p className="text-gray-400 text-sm">
                All programs delivered 100% online, accessible from anywhere in the world.
              </p>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
