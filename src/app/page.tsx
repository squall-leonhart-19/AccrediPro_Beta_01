import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Award,
  BookOpen,
  Users,
  CheckCircle,
  ArrowRight,
  Star,
  GraduationCap,
  MessageSquare,
  Shield,
} from "lucide-react";

export default function HomePage() {
  const features = [
    {
      icon: BookOpen,
      title: "50+ Courses",
      description: "Professional certifications and mini-diplomas designed for career advancement",
    },
    {
      icon: GraduationCap,
      title: "Expert Instructors",
      description: "Learn from industry professionals with years of experience",
    },
    {
      icon: Award,
      title: "Verified Certificates",
      description: "Earn credentials that employers recognize and respect",
    },
    {
      icon: MessageSquare,
      title: "1:1 Mentorship",
      description: "Get personalized guidance from dedicated mentors",
    },
    {
      icon: Users,
      title: "Community Support",
      description: "Connect with like-minded professionals on your journey",
    },
    {
      icon: Shield,
      title: "Lifetime Access",
      description: "Access your courses and materials anytime, forever",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-burgundy-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">AP</span>
              </div>
              <div>
                <span className="text-lg font-bold text-burgundy-600">AccrediPro</span>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-600 hover:text-burgundy-600">
                Features
              </a>
              <a href="#courses" className="text-gray-600 hover:text-burgundy-600">
                Courses
              </a>
              <a href="#testimonials" className="text-gray-600 hover:text-burgundy-600">
                Testimonials
              </a>
            </div>

            <div className="flex items-center gap-4">
              <Link href="/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/register">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-burgundy-50 via-white to-gold-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <Badge variant="secondary" className="mb-6 bg-gold-100 text-gold-800 border-0">
              Empowering Professional Women Since 2024
            </Badge>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Advance Your Career with
              <span className="gradient-text"> AccrediPro</span>
            </h1>

            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Professional certifications and mini-diplomas designed for women 40+
              who are ready to take their careers to the next level.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Link href="/register">
                <Button size="xl" className="w-full sm:w-auto">
                  Start Learning Today
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/catalog">
                <Button variant="outline" size="xl" className="w-full sm:w-auto">
                  Browse Courses
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 pt-8 border-t border-gray-200">
              <div className="text-center">
                <p className="text-3xl font-bold text-burgundy-600">10,000+</p>
                <p className="text-gray-500">Students</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-burgundy-600">50+</p>
                <p className="text-gray-500">Courses</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-burgundy-600">95%</p>
                <p className="text-gray-500">Completion Rate</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-burgundy-600">4.9</p>
                <p className="text-gray-500">Star Rating</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Why Choose AccrediPro?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We're committed to providing the best learning experience for professional women.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-6 rounded-2xl border border-gray-200 hover:border-burgundy-200 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 bg-burgundy-100 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-burgundy-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-burgundy-600 to-burgundy-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Career?
          </h2>
          <p className="text-xl text-burgundy-100 mb-8 max-w-2xl mx-auto">
            Join thousands of professional women who have advanced their careers
            with AccrediPro certifications.
          </p>
          <Link href="/register">
            <Button size="xl" variant="secondary" className="bg-white text-burgundy-700 hover:bg-gray-100">
              Get Started for Free
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              What Our Students Say
            </h2>
            <p className="text-xl text-gray-600">
              Hear from women who have transformed their careers with AccrediPro
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah M.",
                role: "Marketing Director",
                content:
                  "AccrediPro gave me the credentials I needed to land my dream job. The courses are practical and the certificates are recognized by top employers.",
              },
              {
                name: "Jennifer K.",
                role: "HR Manager",
                content:
                  "At 45, I thought it was too late to advance my career. AccrediPro proved me wrong. I've earned two certifications and got promoted!",
              },
              {
                name: "Michelle R.",
                role: "Project Manager",
                content:
                  "The mentorship program is incredible. Having a dedicated mentor helped me stay accountable and actually finish my certification.",
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100"
              >
                <div className="flex gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="w-5 h-5 fill-gold-400 text-gold-400"
                    />
                  ))}
                </div>
                <p className="text-gray-600 mb-6">{testimonial.content}</p>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
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
                Empowering professional women with world-class certifications and
                mini-diplomas.
              </p>
              <p className="text-gray-500 text-sm mt-4 italic">
                Veritas Et Excellentia
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Programs</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="/catalog" className="hover:text-white">All Courses</a></li>
                <li><a href="/catalog" className="hover:text-white">Certifications</a></li>
                <li><a href="/catalog" className="hover:text-white">Mini Diplomas</a></li>
                <li><a href="/mentorship" className="hover:text-white">Mentorship</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white">About Us</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="/privacy" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="/terms" className="hover:text-white">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white">Cookie Policy</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-800 text-center text-gray-400 text-sm">
            <p>&copy; {new Date().getFullYear()} AccrediPro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
