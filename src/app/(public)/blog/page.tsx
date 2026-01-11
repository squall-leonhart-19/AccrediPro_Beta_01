import Link from "next/link";
import { PublicLayout } from "@/components/public/public-layout";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Clock,
  ArrowRight,
  Tag,
  User,
  Search,
  TrendingUp,
} from "lucide-react";

export const metadata = {
  title: "Blog | AccrediPro Standards Institute",
  description: "Expert insights on functional medicine, health coaching, certification, and building a wellness practice. Resources for health professionals.",
  openGraph: {
    title: "ASI Blog",
    description: "Expert insights for health and wellness professionals.",
  },
};

const featuredPost = {
  title: "The Complete Guide to Starting a Functional Medicine Practice in 2025",
  excerpt: "Everything you need to know about launching your functional medicine practice, from certification to getting your first clients.",
  category: "Practice Building",
  readTime: "12 min read",
  date: "January 8, 2025",
  image: null,
  slug: "/blog/starting-functional-medicine-practice-2025",
};

const categories = [
  { name: "All", count: 48 },
  { name: "Functional Medicine", count: 15 },
  { name: "Career Guide", count: 12 },
  { name: "Practice Building", count: 10 },
  { name: "Nutrition", count: 8 },
  { name: "Certification", count: 3 },
];

const posts = [
  {
    title: "5 Signs You're Ready for a Career in Health Coaching",
    excerpt: "Discover the key indicators that suggest you're well-suited for a rewarding career in health and wellness coaching.",
    category: "Career Guide",
    readTime: "6 min read",
    date: "January 6, 2025",
    slug: "/blog/signs-ready-health-coaching-career",
  },
  {
    title: "Understanding Root Cause Medicine: A Beginner's Guide",
    excerpt: "Learn the fundamental principles of root cause medicine and how it differs from conventional symptom-based approaches.",
    category: "Functional Medicine",
    readTime: "8 min read",
    date: "January 4, 2025",
    slug: "/blog/root-cause-medicine-guide",
  },
  {
    title: "How to Price Your Wellness Services for Profit",
    excerpt: "Practical strategies for setting prices that reflect your value and ensure a sustainable practice.",
    category: "Practice Building",
    readTime: "7 min read",
    date: "January 2, 2025",
    slug: "/blog/pricing-wellness-services",
  },
  {
    title: "The Gut-Brain Connection: What Every Practitioner Should Know",
    excerpt: "Explore the fascinating science behind the gut-brain axis and its implications for client health.",
    category: "Functional Medicine",
    readTime: "10 min read",
    date: "December 28, 2024",
    slug: "/blog/gut-brain-connection",
  },
  {
    title: "Building Client Trust in Your First Year of Practice",
    excerpt: "Proven techniques for establishing credibility and building lasting relationships with clients.",
    category: "Practice Building",
    readTime: "5 min read",
    date: "December 26, 2024",
    slug: "/blog/building-client-trust",
  },
  {
    title: "Why Accreditation Matters for Your Certification",
    excerpt: "Understanding the importance of accredited credentials and how they impact your career prospects.",
    category: "Certification",
    readTime: "4 min read",
    date: "December 24, 2024",
    slug: "/blog/why-accreditation-matters",
  },
];

export default function BlogPage() {
  return (
    <PublicLayout>
      {/* Hero */}
      <section className="py-16 lg:py-20 bg-gradient-to-br from-burgundy-50 via-white to-gold-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 bg-burgundy-100 text-burgundy-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <BookOpen className="w-4 h-4" />
              ASI Blog
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Insights & Resources
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Expert guidance on functional medicine, building your practice,
              and thriving as a health professional.
            </p>
          </div>

          {/* Search */}
          <div className="max-w-xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="search"
                placeholder="Search articles..."
                className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-burgundy-500 focus:border-burgundy-500 outline-none"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Post */}
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <Link href={featuredPost.slug}>
            <div className="bg-gradient-to-br from-burgundy-600 to-burgundy-800 rounded-2xl p-8 lg:p-12 text-white hover:shadow-xl transition-shadow">
              <div className="flex flex-col lg:flex-row gap-8 items-center">
                <div className="flex-1">
                  <span className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-sm mb-4">
                    <TrendingUp className="w-4 h-4" /> Featured
                  </span>
                  <h2 className="text-2xl lg:text-3xl font-bold mb-4">
                    {featuredPost.title}
                  </h2>
                  <p className="text-burgundy-100 mb-6">
                    {featuredPost.excerpt}
                  </p>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-burgundy-200">
                    <span className="flex items-center gap-1">
                      <Tag className="w-4 h-4" />
                      {featuredPost.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {featuredPost.readTime}
                    </span>
                    <span>{featuredPost.date}</span>
                  </div>
                </div>
                <div className="lg:w-64 flex-shrink-0">
                  <div className="bg-white/10 rounded-xl p-8 text-center">
                    <BookOpen className="w-16 h-16 text-gold-400 mx-auto mb-4" />
                    <span className="text-gold-400 font-medium">Read Now →</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Categories + Posts */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Sidebar */}
            <div className="lg:w-64 flex-shrink-0">
              <h3 className="font-bold text-gray-900 mb-4">Categories</h3>
              <ul className="space-y-2">
                {categories.map((category, i) => (
                  <li key={i}>
                    <button className={`w-full flex items-center justify-between px-4 py-2 rounded-lg text-left transition-colors ${i === 0 ? "bg-burgundy-600 text-white" : "text-gray-600 hover:bg-gray-100"
                      }`}>
                      {category.name}
                      <span className={`text-xs ${i === 0 ? "text-burgundy-200" : "text-gray-400"}`}>
                        {category.count}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>

              <div className="mt-8 bg-burgundy-50 rounded-xl p-6">
                <h4 className="font-bold text-gray-900 mb-2">Get Certified</h4>
                <p className="text-gray-600 text-sm mb-4">
                  Ready to start your professional journey?
                </p>
                <Link href="/fm-course-certification">
                  <Button size="sm" className="w-full bg-burgundy-600 hover:bg-burgundy-700">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>

            {/* Posts Grid */}
            <div className="flex-1">
              <div className="grid md:grid-cols-2 gap-6">
                {posts.map((post, i) => (
                  <Link key={i} href={post.slug}>
                    <article className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-shadow h-full">
                      <span className="inline-flex items-center gap-1 text-xs text-burgundy-600 bg-burgundy-50 px-2 py-1 rounded-full mb-3">
                        <Tag className="w-3 h-3" />
                        {post.category}
                      </span>
                      <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {post.readTime}
                        </span>
                        <span>{post.date}</span>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>

              {/* Load More */}
              <div className="text-center mt-12">
                <Button variant="outline" size="lg">
                  Load More Articles
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-16 bg-burgundy-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Get Weekly Insights
          </h2>
          <p className="text-burgundy-100 mb-8">
            Join 15,000+ health professionals receiving our weekly newsletter.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 px-4 py-3 rounded-xl border-0 focus:ring-2 focus:ring-gold-400 outline-none"
            />
            <Button className="bg-gold-500 text-gray-900 hover:bg-gold-400">
              Subscribe
            </Button>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
