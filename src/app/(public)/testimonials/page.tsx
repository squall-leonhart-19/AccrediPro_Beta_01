import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Star,
  MapPin,
  ArrowRight,
  Play,
} from "lucide-react";

export const metadata = {
  title: "Student Testimonials & Success Stories",
  description: "Read real success stories from AccrediPro graduates. See how our functional medicine certification transformed careers and lives worldwide. 98% satisfaction rate.",
  openGraph: {
    title: "Success Stories from AccrediPro Graduates",
    description: "1,000+ graduates, 98% satisfaction rate. Read how functional medicine certification transformed their careers.",
    type: "website",
  },
  alternates: {
    canonical: "https://accredipro.academy/testimonials",
  },
};

export default function TestimonialsPage() {
  const stats = [
    { value: "1,000+", label: "Graduates Worldwide" },
    { value: "98%", label: "Student Satisfaction" },
    { value: "4.9/5", label: "Average Rating" },
    { value: "30+", label: "Countries Represented" },
  ];

  const featuredTestimonials = [
    {
      name: "Sarah Mitchell",
      role: "Former Nurse → Functional Medicine Practitioner",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&h=150&q=80",
      quote: "After 15 years as an ER nurse, I was burned out and disillusioned with the healthcare system. AccrediPro gave me the knowledge and credentials to start my own functional medicine practice. Within 6 months of graduating, I replaced my nursing income and now work from home helping clients heal from chronic conditions.",
      location: "Austin, Texas, USA",
      rating: 5,
    },
    {
      name: "James Turner",
      role: "Personal Trainer → Health Coach",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&h=150&q=80",
      quote: "The accreditation was key for me. I was already a personal trainer but clients kept asking about nutrition and hormones. Now with my AccrediPro certification, I can offer comprehensive health coaching AND get professional insurance. My client retention doubled!",
      location: "London, UK",
      rating: 5,
    },
    {
      name: "Emma Lawson",
      role: "Stay-at-Home Mom → Online Health Coach",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&h=150&q=80",
      quote: "I started AccrediPro with zero healthcare background—just a passion for wellness and a dream to help others. The self-paced format let me study while my kids slept. Now I run a thriving online practice specializing in gut health, and I set my own hours!",
      location: "Sydney, Australia",
      rating: 5,
    },
    {
      name: "Dr. Michael Rodriguez",
      role: "Pharmacist → Functional Medicine Consultant",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&h=150&q=80",
      quote: "As a pharmacist, I knew medications weren't solving root causes. AccrediPro filled the gap in my education with practical, actionable protocols. The CPD certification counted towards my pharmacy continuing education—a bonus! Now I consult on the side and plan to transition full-time next year.",
      location: "Toronto, Canada",
      rating: 5,
    },
  ];

  const quickReviews = [
    {
      quote: "The curriculum is incredibly comprehensive. I compared 5 different programs and AccrediPro had the most depth for the best price.",
      author: "Lisa K., USA",
    },
    {
      quote: "Got my insurance approval within 2 weeks of graduating. The IPHM accreditation made the process seamless.",
      author: "Mark T., UK",
    },
    {
      quote: "The business module alone was worth the investment. I launched my practice with clients before I even graduated!",
      author: "Anna S., Germany",
    },
    {
      quote: "Daily mentorship is incredible. Whenever I had questions, the coaches responded within hours. True support.",
      author: "David M., New Zealand",
    },
    {
      quote: "I can finally use MCMA after my name. It adds so much credibility when marketing to potential clients.",
      author: "Rachel P., Ireland",
    },
    {
      quote: "The 14 individual certificates are genius. I can specialize in hormones AND gut health with proof.",
      author: "Chen W., Singapore",
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
              <Link href="/testimonials" className="text-burgundy-600 font-semibold">Testimonials</Link>
              <Link href="/about" className="text-gray-600 hover:text-burgundy-600">About</Link>
              <Link href="/blog" className="text-gray-600 hover:text-burgundy-600">Blog</Link>
              <Link href="/contact" className="text-gray-600 hover:text-burgundy-600">Contact</Link>
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
            Success Stories
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
            Real Students. <span className="text-burgundy-600 italic">Real Results.</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-2xl mx-auto">
            Discover how AccrediPro graduates are transforming lives—including their own. These are their stories.
          </p>
          {/* Rating Badge */}
          <div className="inline-flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-sm">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-gold-500 fill-gold-500" />
              ))}
            </div>
            <span className="text-gray-900 font-bold">4.9/5</span>
            <span className="text-gray-500">from 500+ reviews</span>
          </div>
        </div>
      </header>

      {/* Stats Bar */}
      <section className="py-12 bg-white border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index}>
                <div className="text-4xl font-bold text-burgundy-600 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Testimonials */}
      <section className="py-20 bg-burgundy-50/30">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-gold-600 font-bold uppercase tracking-wider text-sm">Featured Stories</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">Transformation Journeys</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {featuredTestimonials.map((testimonial, index) => (
              <article key={index} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition">
                <div className="flex items-center gap-4 mb-6">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover border-4 border-gold-400"
                  />
                  <div>
                    <h3 className="font-bold text-gray-900">{testimonial.name}</h3>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                    <div className="flex gap-0.5 text-gold-500 mt-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-current" />
                      ))}
                    </div>
                  </div>
                </div>
                <blockquote className="text-gray-600 italic mb-4">
                  "{testimonial.quote}"
                </blockquote>
                <div className="flex items-center gap-2 text-sm text-burgundy-600 font-semibold">
                  <MapPin className="w-4 h-4" />
                  <span>{testimonial.location}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* More Testimonials Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-gold-600 font-bold uppercase tracking-wider text-sm">More Reviews</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">What Our Students Say</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {quickReviews.map((review, index) => (
              <div key={index} className="bg-burgundy-50 p-6 rounded-xl">
                <div className="flex gap-0.5 text-gold-500 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 text-sm mb-4">"{review.quote}"</p>
                <p className="font-bold text-gray-900 text-sm">— {review.author}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Testimonial Placeholder */}
      <section className="py-20 bg-burgundy-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="text-gold-400 font-bold uppercase tracking-wider text-sm block mb-4">
            Video Testimonials
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Hear From Our Graduates</h2>
          <p className="text-burgundy-100 mb-8">Watch real students share their AccrediPro experience.</p>
          <div className="aspect-video bg-white/10 rounded-2xl flex items-center justify-center border border-white/20">
            <div className="text-center">
              <Play className="w-16 h-16 text-gold-400 mx-auto mb-4" />
              <p className="text-burgundy-200">Video testimonials coming soon</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-burgundy-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Ready to Write Your Success Story?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Join 1,000+ graduates who transformed their careers with AccrediPro.
          </p>
          <Link href="/register">
            <Button size="xl">
              Start Your Journey
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
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
                The world's most accredited functional medicine certification. Join 1,000+ successful graduates.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="/" className="hover:text-white">Home</Link></li>
                <li><Link href="/certifications" className="hover:text-white">Certifications</Link></li>
                <li><Link href="/accreditation" className="hover:text-white">Accreditation</Link></li>
                <li><Link href="/testimonials" className="hover:text-white text-burgundy-400">Testimonials</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="/blog" className="hover:text-white">Blog</Link></li>
                <li><Link href="/about" className="hover:text-white">About Us</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
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
