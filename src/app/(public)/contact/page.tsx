import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Mail,
  Clock,
  Share2,
  ArrowRight,
} from "lucide-react";

export const metadata = {
  title: "Contact Us - Get In Touch",
  description: "Get in touch with AccrediPro Academy. Contact our admissions team for enrollment questions, support, or partnership inquiries. Email: info@accredipro.academy",
  openGraph: {
    title: "Contact AccrediPro Academy",
    description: "Questions about our functional medicine certification? Our team responds within 24 hours.",
    type: "website",
  },
  alternates: {
    canonical: "https://accredipro.academy/contact",
  },
};

export default function ContactPage() {
  const contactInfo = [
    {
      icon: Mail,
      title: "Email Us",
      description: "For general inquiries and support",
      value: "info@accredipro.academy",
      isLink: true,
    },
    {
      icon: Clock,
      title: "Response Time",
      description: "We aim to respond within",
      value: "24-48 Hours",
      isLink: false,
    },
    {
      icon: Share2,
      title: "Follow Us",
      description: "Stay connected on social media",
      value: "social",
      isLink: false,
    },
  ];

  const quickLinks = [
    {
      href: "/accreditation",
      title: "What accreditations do you have?",
      description: "Learn about our 9 international accreditations →",
    },
    {
      href: "/catalog",
      title: "What certifications will I receive?",
      description: "Explore our 14-module certification program →",
    },
    {
      href: "/register",
      title: "How much does it cost?",
      description: "View pricing and payment options →",
    },
    {
      href: "/testimonials",
      title: "What do students say?",
      description: "Read success stories from graduates →",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-burgundy-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">AP</span>
              </div>
              <span className="text-lg font-bold text-burgundy-600">AccrediPro</span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <Link href="/certifications" className="text-gray-600 hover:text-burgundy-600">Certifications</Link>
              <Link href="/accreditation" className="text-gray-600 hover:text-burgundy-600">Accreditations</Link>
              <Link href="/testimonials" className="text-gray-600 hover:text-burgundy-600">Testimonials</Link>
              <Link href="/about" className="text-gray-600 hover:text-burgundy-600">About</Link>
              <Link href="/blog" className="text-gray-600 hover:text-burgundy-600">Blog</Link>
              <Link href="/contact" className="text-burgundy-600 font-semibold">Contact</Link>
            </div>

            <div className="flex items-center gap-4">
              <Link href="/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/register">
                <Button>Apply Now</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <header className="pt-32 pb-20 px-4 bg-gradient-to-br from-burgundy-50 via-white to-gold-50">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-burgundy-600 font-bold uppercase tracking-wider text-sm mb-4 block">
            Get In Touch
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
            We're Here to <span className="text-burgundy-600 italic">Help</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-2xl mx-auto">
            Have questions about our programs, accreditations, or enrollment process? Our dedicated team is ready to assist you on your journey to becoming a certified functional medicine practitioner.
          </p>
        </div>
      </header>

      {/* Contact Info Cards */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {contactInfo.map((info, index) => (
              <div key={index} className="bg-burgundy-50 p-8 rounded-2xl text-center hover:shadow-xl transition group">
                <div className="w-20 h-20 bg-burgundy-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition">
                  <info.icon className="w-8 h-8 text-gold-400" />
                </div>
                <h3 className="font-bold text-xl text-gray-900 mb-2">{info.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{info.description}</p>
                {info.value === "social" ? (
                  <div className="flex justify-center gap-4">
                    <a href="#" className="w-10 h-10 bg-burgundy-600 text-white rounded-full flex items-center justify-center hover:bg-gold-500 transition">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                    </a>
                    <a href="#" className="w-10 h-10 bg-burgundy-600 text-white rounded-full flex items-center justify-center hover:bg-gold-500 transition">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"/></svg>
                    </a>
                    <a href="#" className="w-10 h-10 bg-burgundy-600 text-white rounded-full flex items-center justify-center hover:bg-gold-500 transition">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                    </a>
                  </div>
                ) : info.isLink ? (
                  <a href={`mailto:${info.value}`} className="text-burgundy-600 font-bold text-lg hover:text-gold-600 transition">
                    {info.value}
                  </a>
                ) : (
                  <span className="text-burgundy-600 font-bold text-lg">{info.value}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-20 bg-burgundy-50/30">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white p-8 md:p-12 rounded-2xl shadow-xl">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Send Us a Message</h2>
              <p className="text-gray-600">Fill out the form below and we'll get back to you as soon as possible.</p>
            </div>

            <form action="#" method="POST" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">First Name *</label>
                  <input
                    type="text"
                    name="first_name"
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-burgundy-500 focus:border-transparent transition"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">Last Name *</label>
                  <input
                    type="text"
                    name="last_name"
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-burgundy-500 focus:border-transparent transition"
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-burgundy-500 focus:border-transparent transition"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Inquiry Type</label>
                <select
                  name="inquiry_type"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-burgundy-500 focus:border-transparent transition"
                >
                  <option value="">Select an option</option>
                  <option value="enrollment">Enrollment Questions</option>
                  <option value="curriculum">Curriculum Information</option>
                  <option value="accreditation">Accreditation Details</option>
                  <option value="payment">Payment & Financing</option>
                  <option value="technical">Technical Support</option>
                  <option value="partnership">Partnership Inquiry</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Your Message *</label>
                <textarea
                  name="message"
                  rows={5}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-burgundy-500 focus:border-transparent transition resize-none"
                  placeholder="Tell us how we can help you..."
                />
              </div>

              <div className="flex items-start gap-3">
                <input type="checkbox" id="consent" name="consent" required className="mt-1" />
                <label htmlFor="consent" className="text-sm text-gray-600">
                  I agree to receive communications from AccrediPro Academy. You can unsubscribe at any time.
                </label>
              </div>

              <Button type="submit" className="w-full py-4 text-lg">
                Send Message
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* FAQ Quick Links */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Common Questions</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {quickLinks.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className="p-6 bg-burgundy-50 rounded-xl hover:bg-burgundy-100 transition text-left group"
              >
                <h3 className="font-bold text-gray-900 mb-2 group-hover:text-burgundy-600 transition">
                  {link.title}
                </h3>
                <p className="text-sm text-gray-600">{link.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-burgundy-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">AP</span>
                </div>
                <span className="text-lg font-bold">AccrediPro</span>
              </div>
              <p className="text-gray-400 text-sm">
                The world's most accredited functional medicine certification. 9 international accreditations. Practice legally in 30+ countries.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="/" className="hover:text-white">Home</Link></li>
                <li><Link href="/certifications" className="hover:text-white">Certifications</Link></li>
                <li><Link href="/accreditation" className="hover:text-white">Accreditation</Link></li>
                <li><Link href="/contact" className="hover:text-white text-burgundy-400">Contact</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="/blog" className="hover:text-white">Blog</Link></li>
                <li><Link href="/testimonials" className="hover:text-white">Testimonials</Link></li>
                <li><Link href="/about" className="hover:text-white">About Us</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <p className="text-sm text-gray-400">
                <a href="mailto:info@accredipro.academy" className="hover:text-white">
                  info@accredipro.academy
                </a>
              </p>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-800 text-center text-gray-400 text-sm">
            <p>&copy; {new Date().getFullYear()} AccrediPro Academy. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
