import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  HelpCircle,
  Search,
  BookOpen,
  MessageCircle,
  Mail,
  Phone,
  FileQuestion,
  CreditCard,
  Settings,
  Shield,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { ContactSupportDialog } from "@/components/help/contact-support-dialog";

const faqCategories = [
  {
    id: "getting-started",
    title: "Getting Started",
    icon: BookOpen,
    color: "bg-burgundy-100 text-burgundy-600",
    questions: [
      { q: "How do I start a course?", a: "Navigate to Course Catalog, select your course, and click 'Enroll' or 'Start Learning'." },
      { q: "How do I track my progress?", a: "Your progress is automatically saved. Check your Dashboard or My Courses to see completion percentages." },
      { q: "Can I download course materials?", a: "Yes! Visit the Resources page to download all materials from your enrolled courses." },
    ],
  },
  {
    id: "account",
    title: "Account & Profile",
    icon: Settings,
    color: "bg-purple-100 text-purple-600",
    questions: [
      { q: "How do I update my profile?", a: "Go to Profile in the sidebar to update your information, photo, and preferences." },
      { q: "How do I change my password?", a: "Visit Profile > Security to change your password or enable two-factor authentication." },
      { q: "Can I change my email address?", a: "Yes, contact support to change your email address for security verification." },
    ],
  },
  {
    id: "billing",
    title: "Billing & Payments",
    icon: CreditCard,
    color: "bg-green-100 text-green-600",
    questions: [
      { q: "What payment methods do you accept?", a: "We accept all major credit cards, PayPal, and bank transfers for select regions." },
      { q: "How do I access my receipt?", a: "Your payment receipts are automatically sent to your email. You can also contact support for a copy." },
      { q: "Is my payment secure?", a: "Yes! We use industry-standard SSL encryption and secure payment processors to protect your information." },
    ],
  },
  {
    id: "certificates",
    title: "Certificates",
    icon: Shield,
    color: "bg-gold-100 text-gold-600",
    questions: [
      { q: "When do I receive my certificate?", a: "Certificates are automatically generated upon course completion. Check the Certificates page." },
      { q: "Are certificates accredited?", a: "Our certifications are accredited by relevant professional bodies. Details are on each course page." },
      { q: "Can I share my certificate?", a: "Yes! Download your certificate or share directly to LinkedIn from the Certificates page." },
    ],
  },
];

async function getSarahCoach() {
  // Find Sarah (the coach/mentor) for Live Chat
  const sarah = await prisma.user.findFirst({
    where: {
      OR: [
        { email: "coach@accredipro-certificate.com" },
        { role: "MENTOR", firstName: { contains: "Sarah" } },
        { role: "ADMIN" },
      ],
    },
    orderBy: { role: "asc" }, // Prefer ADMIN if multiple matches
    select: { id: true, firstName: true, lastName: true },
  });
  return sarah;
}

export default async function HelpPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  const sarahCoach = await getSarahCoach();

  const contactOptions = [
    {
      title: "Email Support",
      description: "Get help via email within 24 hours",
      icon: Mail,
      action: "support@accredipro.academy",
      type: "email" as const,
      href: "mailto:support@accredipro.academy",
    },
    {
      title: "Live Chat",
      description: `Chat with ${sarahCoach ? `${sarahCoach.firstName} ${sarahCoach.lastName}` : "our support team"}`,
      icon: MessageCircle,
      action: "Start Chat",
      type: "chat" as const,
      href: sarahCoach ? `/messages?chat=${sarahCoach.id}` : "/messages",
    },
    {
      title: "Schedule a Call",
      description: "Book a call with our team",
      icon: Phone,
      action: "Book Call",
      type: "call" as const,
      href: "#",
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Header */}
      <Card className="bg-gradient-to-br from-burgundy-600 via-burgundy-700 to-burgundy-800 border-0 overflow-hidden relative">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold-400 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
        </div>
        <CardContent className="p-8 relative">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
              <HelpCircle className="w-7 h-7 text-gold-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Help & Support</h1>
              <p className="text-burgundy-200">We&apos;re here to assist you</p>
            </div>
          </div>
          <p className="text-burgundy-100 max-w-2xl mb-6">
            Access FAQs, troubleshooting guides, technical support, billing help, and direct contact
            options. We&apos;re here to assist you on your learning journey.
          </p>

          {/* Search */}
          <div className="relative max-w-lg">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search for help..."
              className="pl-12 py-6 bg-white/10 border-white/20 text-white placeholder:text-burgundy-200 focus:bg-white/20"
            />
          </div>
        </CardContent>
      </Card>

      {/* Contact Options */}
      <div className="grid md:grid-cols-3 gap-4">
        {contactOptions.map((option) => (
          <Card key={option.title} className="card-premium hover:border-burgundy-200 transition-colors">
            <CardContent className="p-6 text-center">
              <div className="w-14 h-14 rounded-2xl bg-burgundy-100 flex items-center justify-center mx-auto mb-4">
                <option.icon className="w-7 h-7 text-burgundy-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{option.title}</h3>
              <p className="text-sm text-gray-500 mb-4">{option.description}</p>
              {option.type === "email" ? (
                <ContactSupportDialog
                  trigger={
                    <Button variant="outline" className="w-full">
                      {option.action}
                      <Mail className="w-4 h-4 ml-2" />
                    </Button>
                  }
                />
              ) : option.type === "chat" ? (
                <Link href={option.href}>
                  <Button className="w-full bg-burgundy-600 hover:bg-burgundy-700">
                    {option.action}
                  </Button>
                </Link>
              ) : (
                <Button className="w-full bg-burgundy-600 hover:bg-burgundy-700">
                  {option.action}
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* FAQ Categories */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <FileQuestion className="w-5 h-5 text-burgundy-600" />
          Frequently Asked Questions
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {faqCategories.map((category) => (
            <Card key={category.id} className="card-premium">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-3 text-lg">
                  <div className={`w-10 h-10 rounded-xl ${category.color} flex items-center justify-center`}>
                    <category.icon className="w-5 h-5" />
                  </div>
                  {category.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-4">
                  {category.questions.map((faq, index) => (
                    <div key={index} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                      <h4 className="font-medium text-gray-900 text-sm mb-1">{faq.q}</h4>
                      <p className="text-sm text-gray-500">{faq.a}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Quick Links */}
      <Card className="card-premium">
        <CardHeader>
          <CardTitle className="text-lg">Quick Links</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            <Link href="/profile" className="block">
              <div className="p-4 rounded-xl bg-gray-50 hover:bg-burgundy-50 transition-colors group">
                <Settings className="w-5 h-5 text-gray-400 group-hover:text-burgundy-600 mb-2" />
                <p className="font-medium text-gray-900 text-sm">Account Settings</p>
                <p className="text-xs text-gray-500">Manage your account</p>
              </div>
            </Link>
            <Link href="/certificates" className="block">
              <div className="p-4 rounded-xl bg-gray-50 hover:bg-burgundy-50 transition-colors group">
                <Shield className="w-5 h-5 text-gray-400 group-hover:text-burgundy-600 mb-2" />
                <p className="font-medium text-gray-900 text-sm">Certificates</p>
                <p className="text-xs text-gray-500">View & download</p>
              </div>
            </Link>
            <Link href="/resources" className="block">
              <div className="p-4 rounded-xl bg-gray-50 hover:bg-burgundy-50 transition-colors group">
                <BookOpen className="w-5 h-5 text-gray-400 group-hover:text-burgundy-600 mb-2" />
                <p className="font-medium text-gray-900 text-sm">Resources</p>
                <p className="text-xs text-gray-500">Download materials</p>
              </div>
            </Link>
            <Link href="/messages" className="block">
              <div className="p-4 rounded-xl bg-gray-50 hover:bg-burgundy-50 transition-colors group">
                <MessageCircle className="w-5 h-5 text-gray-400 group-hover:text-burgundy-600 mb-2" />
                <p className="font-medium text-gray-900 text-sm">Contact Coach</p>
                <p className="text-xs text-gray-500">Get personalized help</p>
              </div>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Still Need Help */}
      <Card className="card-premium bg-gradient-to-r from-burgundy-50 to-gold-50 border-burgundy-100">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-burgundy-100 flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-burgundy-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Still need help?</h3>
                <p className="text-sm text-gray-600">
                  Our support team is ready to assist you with any questions.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <ContactSupportDialog />
              <Link href={sarahCoach ? `/messages?chat=${sarahCoach.id}` : "/messages"}>
                <Button className="bg-burgundy-600 hover:bg-burgundy-700">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Start Live Chat
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
