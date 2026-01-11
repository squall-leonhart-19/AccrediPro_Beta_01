import Link from "next/link";
import { PublicLayout } from "@/components/public/public-layout";
import { Button } from "@/components/ui/button";
import {
  Star,
  Quote,
  ArrowRight,
  CheckCircle,
  DollarSign,
  Briefcase,
  Heart,
  Award,
  TrendingUp,
  MapPin,
} from "lucide-react";

export const metadata = {
  title: "Success Stories | AccrediPro Standards Institute",
  description: "Read real stories from ASI certified professionals who transformed their careers. See how our graduates are making a difference.",
  openGraph: {
    title: "ASI Success Stories",
    description: "Real stories from certified health and wellness professionals.",
  },
};

const featuredTestimonials = [
  {
    name: "Sarah M.",
    credential: "FM-CP™",
    location: "Austin, TX",
    image: null,
    rating: 5,
    headline: "From Burned-Out Nurse to Thriving Practitioner",
    story: "After 15 years as an ER nurse, I was exhausted and searching for something more fulfilling. AccrediPro gave me the knowledge and confidence to start my own functional medicine practice. Within 6 months of certification, I had my first 20 clients.",
    outcome: "Now earning $8,500/month with a waitlist",
    tags: ["Career Change", "Nurse", "Practice Owner"],
  },
  {
    name: "Jennifer K.",
    credential: "BC-FMP™",
    location: "Denver, CO",
    image: null,
    rating: 5,
    headline: "The Best Investment in My Future",
    story: "I compared dozens of programs before choosing AccrediPro. The combination of rigorous education, accredited credentials, and business training made all the difference. I'm now board certified and running a six-figure practice.",
    outcome: "Six-figure practice in year two",
    tags: ["Board Certified", "Six Figures", "Practice Owner"],
  },
  {
    name: "Michelle T.",
    credential: "FM-CP™",
    location: "Miami, FL",
    image: null,
    rating: 5,
    headline: "Finally Found My Purpose",
    story: "As a stay-at-home mom looking to re-enter the workforce, I needed something flexible but meaningful. The fully online program let me study while managing my family. Now I help other moms optimize their health and have built a thriving coaching business.",
    outcome: "Part-time practice earning $4,000/month",
    tags: ["Mom", "Flexible Schedule", "Part-Time"],
  },
];

const moreTestimonials = [
  {
    name: "David R.",
    credential: "FM-CP™",
    location: "Seattle, WA",
    quote: "The accreditations made all the difference. I was able to get insurance and start seeing clients within weeks of certification.",
  },
  {
    name: "Lisa H.",
    credential: "HN-CP™",
    location: "Phoenix, AZ",
    quote: "The curriculum was comprehensive but accessible. Coach Sarah was there for me every step of the way.",
  },
  {
    name: "Mark T.",
    credential: "FM-FC™",
    location: "Boston, MA",
    quote: "Even the Foundation Certificate gave me enough knowledge to help my family transform their health habits.",
  },
  {
    name: "Amanda P.",
    credential: "BC-FMP™",
    location: "Chicago, IL",
    quote: "Board certification opened doors I never expected. I'm now consulting for a major wellness company.",
  },
  {
    name: "Carlos G.",
    credential: "FM-CP™",
    location: "Los Angeles, CA",
    quote: "The community and support made this journey special. I've made lifelong connections with other practitioners.",
  },
  {
    name: "Stephanie W.",
    credential: "FM-CP™",
    location: "Nashville, TN",
    quote: "I went from knowing nothing about functional medicine to running my own practice in 8 months. Incredible program.",
  },
];

const stats = [
  { value: "95%", label: "Graduate Satisfaction" },
  { value: "10,000+", label: "Certified Professionals" },
  { value: "50+", label: "Countries" },
  { value: "$5,800", label: "Avg. Monthly Earnings" },
];

export default function TestimonialsPage() {
  return (
    <PublicLayout>
      {/* Hero */}
      <section className="relative py-20 lg:py-28 bg-gradient-to-br from-burgundy-50 via-white to-gold-50 overflow-hidden">
        <div className="relative max-w-5xl mx-auto px-4 text-center">
          <span className="inline-flex items-center gap-2 bg-burgundy-100 text-burgundy-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Heart className="w-4 h-4" />
            Real Stories, Real Results
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Success <span className="text-burgundy-600">Stories</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover how ASI certified professionals are transforming their careers
            and making a real impact in health and wellness.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-burgundy-600">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, i) => (
              <div key={i}>
                <div className="text-4xl font-bold text-gold-400 mb-1">{stat.value}</div>
                <div className="text-sm text-burgundy-200 uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-burgundy-600 font-semibold uppercase tracking-wider text-sm">
              Featured Stories
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
              Transformations That Inspire
            </h2>
          </div>

          <div className="space-y-8">
            {featuredTestimonials.map((testimonial, i) => (
              <div
                key={i}
                className="bg-gray-50 rounded-2xl p-8 lg:p-10"
              >
                <div className="flex flex-col lg:flex-row gap-8">
                  <div className="lg:w-64 flex-shrink-0">
                    <div className="w-20 h-20 bg-gradient-to-br from-burgundy-100 to-burgundy-200 rounded-full flex items-center justify-center mx-auto lg:mx-0 mb-4">
                      <span className="text-2xl font-bold text-burgundy-600">
                        {testimonial.name.charAt(0)}
                      </span>
                    </div>
                    <div className="text-center lg:text-left">
                      <h3 className="font-bold text-gray-900">{testimonial.name}</h3>
                      <p className="text-burgundy-600 font-mono text-sm">{testimonial.credential}</p>
                      <p className="text-gray-500 text-sm flex items-center justify-center lg:justify-start gap-1 mt-1">
                        <MapPin className="w-3 h-3" />
                        {testimonial.location}
                      </p>
                      <div className="flex justify-center lg:justify-start gap-1 mt-3">
                        {[...Array(testimonial.rating)].map((_, j) => (
                          <Star key={j} className="w-4 h-4 text-gold-500 fill-gold-500" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-gray-900 mb-4">
                      "{testimonial.headline}"
                    </h4>
                    <p className="text-gray-600 leading-relaxed mb-6">
                      {testimonial.story}
                    </p>
                    <div className="bg-green-50 border border-green-100 rounded-xl p-4 mb-4">
                      <div className="flex items-center gap-2 text-green-700 font-medium">
                        <TrendingUp className="w-5 h-5" />
                        {testimonial.outcome}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {testimonial.tags.map((tag, j) => (
                        <span
                          key={j}
                          className="text-xs bg-gray-200 text-gray-600 px-3 py-1 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* More Testimonials Grid */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-900">
              More Success Stories
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {moreTestimonials.map((testimonial, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm">
                <Quote className="w-8 h-8 text-burgundy-200 mb-4" />
                <p className="text-gray-600 mb-6 italic">"{testimonial.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-burgundy-100 rounded-full flex items-center justify-center">
                    <span className="text-burgundy-600 font-bold text-sm">
                      {testimonial.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{testimonial.name}</p>
                    <p className="text-burgundy-600 text-xs font-mono">{testimonial.credential}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-burgundy-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Award className="w-16 h-16 text-gold-400 mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Write Your Success Story
          </h2>
          <p className="text-burgundy-100 mb-8 text-lg">
            Join thousands of professionals who have transformed their careers with ASI certification.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/fm-course-certification">
              <Button size="lg" className="bg-white text-burgundy-700 hover:bg-gray-100">
                Start Your Journey <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/how-it-works">
              <Button size="lg" variant="outline" className="border-white/50 text-white hover:bg-white/10">
                See How It Works
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
