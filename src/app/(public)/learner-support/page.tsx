import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    Heart,
    Users,
    MessageCircle,
    Compass,
    CheckCircle,
    ArrowRight,
    BookOpen,
    Sparkles,
    HelpCircle,
} from "lucide-react";

export const metadata = {
    title: "Learner Support | AccrediPro International Standards Institute",
    description: "AccrediPro ISI's comprehensive support services for candidates including guidance, wellbeing resources, and academic assistance.",
};

const BRAND = {
    burgundy: "#722f37",
    burgundyDark: "#4e1f24",
    gold: "#d4af37",
    cream: "#fdf8f0",
};

export default function LearnerSupportPage() {
    const supportAreas = [
        {
            title: "Information, Advice & Guidance",
            description: "Personalized guidance to help you choose the right credential pathway and plan your professional development.",
            icon: Compass,
            services: ["Credential pathway guidance", "Career advice", "Application support"],
        },
        {
            title: "Academic Support",
            description: "Resources and assistance to help you succeed in your assessments and learning journey.",
            icon: BookOpen,
            services: ["Study skills resources", "Assessment preparation", "Learning accommodations"],
        },
        {
            title: "Wellbeing Support",
            description: "Resources to support your mental health and wellbeing during your credential journey.",
            icon: Heart,
            services: ["Stress management resources", "Work-life balance guidance", "Signposting to external services"],
        },
        {
            title: "Community Connection",
            description: "Access to peer networks and professional community for ongoing support and collaboration.",
            icon: Users,
            services: ["Study groups", "Peer mentoring", "Alumni network"],
        },
    ];

    const contacts = [
        {
            title: "General Inquiries",
            description: "Questions about programs, applications, or credentials",
            action: "Contact Support",
        },
        {
            title: "Academic Support",
            description: "Assessment assistance, study resources, accommodations",
            action: "Contact Academic Services",
        },
        {
            title: "Technical Support",
            description: "Platform access, technical issues, account help",
            action: "Contact Tech Support",
        },
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* Hero */}
            <section className="relative py-16 text-white" style={{ backgroundColor: BRAND.burgundyDark }}>
                <div className="max-w-5xl mx-auto px-4">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ backgroundColor: `${BRAND.gold}20`, border: `1px solid ${BRAND.gold}40` }}>
                        <Heart className="w-4 h-4" style={{ color: BRAND.gold }} />
                        <span className="text-sm font-medium" style={{ color: BRAND.gold }}>Candidate Services</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Learner Support</h1>
                    <p className="text-xl max-w-3xl" style={{ color: "#f5e6e8" }}>
                        Your success is our priority. AccrediPro ISI provides comprehensive support
                        services to help you achieve your professional goals.
                    </p>
                </div>
            </section>

            {/* Commitment */}
            <section className="py-12 border-b border-gray-100" style={{ backgroundColor: BRAND.cream }}>
                <div className="max-w-5xl mx-auto px-4">
                    <div className="bg-white rounded-xl p-8 border border-gray-100">
                        <h2 className="text-xl font-bold mb-4" style={{ color: BRAND.burgundy }}>Our Commitment to You</h2>
                        <p className="text-gray-600 leading-relaxed">
                            AccrediPro ISI is committed to providing high-quality, impartial information,
                            advice, and guidance to all candidates. We recognize that every individual's
                            circumstances are different, and we strive to provide personalized support
                            that meets your specific needs throughout your credential journey.
                        </p>
                    </div>
                </div>
            </section>

            {/* Support Areas */}
            <section className="py-12 border-b border-gray-100">
                <div className="max-w-5xl mx-auto px-4">
                    <h2 className="text-2xl font-bold mb-8" style={{ color: BRAND.burgundy }}>Support Services</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        {supportAreas.map((area, i) => (
                            <div key={i} className="bg-gray-50 rounded-xl p-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: BRAND.burgundy }}>
                                        <area.icon className="w-6 h-6" style={{ color: BRAND.gold }} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold mb-2" style={{ color: BRAND.burgundy }}>{area.title}</h3>
                                        <p className="text-gray-600 text-sm mb-4">{area.description}</p>
                                        <ul className="space-y-2">
                                            {area.services.map((service, j) => (
                                                <li key={j} className="flex items-center gap-2 text-sm text-gray-500">
                                                    <CheckCircle className="w-4 h-4" style={{ color: BRAND.gold }} />
                                                    {service}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Reasonable Adjustments */}
            <section className="py-12" style={{ backgroundColor: BRAND.cream }}>
                <div className="max-w-5xl mx-auto px-4">
                    <h2 className="text-2xl font-bold mb-6" style={{ color: BRAND.burgundy }}>Reasonable Adjustments</h2>
                    <div className="bg-white rounded-xl p-8 border border-gray-100">
                        <p className="text-gray-600 mb-6">
                            AccrediPro ISI is committed to providing equal access to all candidates. If you
                            have a disability, learning difference, or other circumstances that may affect
                            your ability to complete assessments under standard conditions, you may be
                            eligible for reasonable adjustments.
                        </p>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="flex items-start gap-3">
                                <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: BRAND.gold }} />
                                <span className="text-gray-600">Additional time for assessments</span>
                            </div>
                            <div className="flex items-start gap-3">
                                <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: BRAND.gold }} />
                                <span className="text-gray-600">Alternative assessment formats</span>
                            </div>
                            <div className="flex items-start gap-3">
                                <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: BRAND.gold }} />
                                <span className="text-gray-600">Assistive technology use</span>
                            </div>
                            <div className="flex items-start gap-3">
                                <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: BRAND.gold }} />
                                <span className="text-gray-600">Separate assessment space</span>
                            </div>
                        </div>
                        <div className="mt-6 pt-6 border-t border-gray-100">
                            <Link href="/accessibility" className="text-sm font-semibold flex items-center gap-1" style={{ color: BRAND.burgundy }}>
                                View full Accessibility Policy <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact */}
            <section className="py-12 border-b border-gray-100">
                <div className="max-w-5xl mx-auto px-4">
                    <h2 className="text-2xl font-bold mb-8" style={{ color: BRAND.burgundy }}>Get Support</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        {contacts.map((contact, i) => (
                            <div key={i} className="bg-gray-50 rounded-xl p-6 text-center">
                                <HelpCircle className="w-10 h-10 mx-auto mb-3" style={{ color: BRAND.gold }} />
                                <h3 className="font-bold mb-2" style={{ color: BRAND.burgundy }}>{contact.title}</h3>
                                <p className="text-gray-600 text-sm mb-4">{contact.description}</p>
                                <Link href="/contact">
                                    <Button variant="outline" size="sm" style={{ borderColor: BRAND.burgundy, color: BRAND.burgundy }}>
                                        {contact.action}
                                    </Button>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-12 text-center">
                <div className="max-w-3xl mx-auto px-4">
                    <Sparkles className="w-12 h-12 mx-auto mb-4" style={{ color: BRAND.gold }} />
                    <h2 className="text-2xl font-bold mb-4" style={{ color: BRAND.burgundy }}>
                        We're Here to Help
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Have questions or need assistance? Our support team is ready to help you
                        succeed in your professional journey.
                    </p>
                    <Link href="/contact">
                        <Button size="lg" style={{ backgroundColor: BRAND.burgundy, color: "white" }}>
                            Contact Support
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    );
}
