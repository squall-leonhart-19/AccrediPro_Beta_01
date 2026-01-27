import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    ShieldCheck,
    FileText,
    AlertTriangle,
    CheckCircle,
    ArrowRight,
    XCircle,
    Eye,
    Lock,
} from "lucide-react";

export const metadata = {
    title: "Academic Integrity | AccrediPro International Standards Institute",
    description: "AccrediPro ISI's policy on academic integrity, malpractice prevention, and authenticity of assessments and credentials.",
};

const BRAND = {
    burgundy: "#722f37",
    burgundyDark: "#4e1f24",
    gold: "#d4af37",
    cream: "#fdf8f0",
};

export default function AcademicIntegrityPage() {
    const expectations = [
        {
            title: "Original Work",
            description: "All assessments, projects, and submissions must be your own original work unless collaboration is explicitly permitted.",
            icon: FileText,
        },
        {
            title: "Accurate Representation",
            description: "Credentials, qualifications, and experience must be accurately represented in all applications and professional contexts.",
            icon: CheckCircle,
        },
        {
            title: "Assessment Conditions",
            description: "Examinations and assessments must be completed under the specified conditions without unauthorized assistance.",
            icon: Lock,
        },
        {
            title: "Confidentiality",
            description: "Assessment content, questions, and materials must not be shared, reproduced, or distributed.",
            icon: Eye,
        },
    ];

    const malpractice = [
        {
            title: "Plagiarism",
            description: "Submitting work that is not your own, or failing to properly attribute sources and references.",
        },
        {
            title: "Collusion",
            description: "Unauthorized collaboration on assessments designated as individual work.",
        },
        {
            title: "Impersonation",
            description: "Having another person complete assessments on your behalf, or completing assessments for others.",
        },
        {
            title: "Fabrication",
            description: "Creating false data, evidence, references, or credentials to support submissions.",
        },
        {
            title: "Unauthorized Materials",
            description: "Using prohibited resources, notes, or technology during examinations.",
        },
        {
            title: "Assessment Content Sharing",
            description: "Disclosing, sharing, or selling examination content or assessment materials.",
        },
    ];

    const consequences = [
        { severity: "Level 1", action: "Formal warning and resubmission required", examples: "Minor citation errors, first-time referencing mistakes" },
        { severity: "Level 2", action: "Assessment nullified, reassessment required", examples: "Significant plagiarism, unauthorized collaboration" },
        { severity: "Level 3", action: "Credential suspended pending investigation", examples: "Deliberate cheating, impersonation, fabrication" },
        { severity: "Level 4", action: "Credential revoked and permanent record", examples: "Repeated violations, fraud, criminal activity" },
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* Hero */}
            <section className="relative py-16 text-white" style={{ backgroundColor: BRAND.burgundyDark }}>
                <div className="max-w-5xl mx-auto px-4">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ backgroundColor: `${BRAND.gold}20`, border: `1px solid ${BRAND.gold}40` }}>
                        <ShieldCheck className="w-4 h-4" style={{ color: BRAND.gold }} />
                        <span className="text-sm font-medium" style={{ color: BRAND.gold }}>Standards Policy</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Academic Integrity</h1>
                    <p className="text-xl max-w-3xl" style={{ color: "#f5e6e8" }}>
                        The credibility of ISI credentials depends on the integrity of our assessment processes.
                        All candidates are expected to uphold the highest standards of academic honesty.
                    </p>
                </div>
            </section>

            {/* Commitment Statement */}
            <section className="py-12 border-b border-gray-100" style={{ backgroundColor: BRAND.cream }}>
                <div className="max-w-5xl mx-auto px-4">
                    <div className="bg-white rounded-xl p-8 border border-gray-100">
                        <h2 className="text-xl font-bold mb-4" style={{ color: BRAND.burgundy }}>Our Commitment</h2>
                        <p className="text-gray-600 leading-relaxed">
                            AccrediPro International Standards Institute is committed to maintaining the integrity and
                            value of all credentials we issue. Academic integrity is foundational to public trust in
                            our certified professionals and the employers who rely on our standards. All candidates,
                            upon registration, agree to uphold these principles.
                        </p>
                    </div>
                </div>
            </section>

            {/* Expectations */}
            <section className="py-12 border-b border-gray-100">
                <div className="max-w-5xl mx-auto px-4">
                    <h2 className="text-2xl font-bold mb-8" style={{ color: BRAND.burgundy }}>Candidate Expectations</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        {expectations.map((item, i) => (
                            <div key={i} className="flex gap-4 p-6 bg-gray-50 rounded-xl">
                                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: BRAND.burgundy }}>
                                    <item.icon className="w-6 h-6" style={{ color: BRAND.gold }} />
                                </div>
                                <div>
                                    <h3 className="font-bold mb-2" style={{ color: BRAND.burgundy }}>{item.title}</h3>
                                    <p className="text-gray-600 text-sm">{item.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Malpractice */}
            <section className="py-12 border-b border-gray-100">
                <div className="max-w-5xl mx-auto px-4">
                    <h2 className="text-2xl font-bold mb-4" style={{ color: BRAND.burgundy }}>Malpractice & Misconduct</h2>
                    <p className="text-gray-600 mb-8">The following behaviors constitute academic malpractice and will result in disciplinary action:</p>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {malpractice.map((item, i) => (
                            <div key={i} className="bg-gray-50 rounded-xl p-5">
                                <div className="flex items-center gap-2 mb-2">
                                    <XCircle className="w-4 h-4 text-red-500" />
                                    <h3 className="font-bold" style={{ color: BRAND.burgundy }}>{item.title}</h3>
                                </div>
                                <p className="text-gray-600 text-sm">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Consequences */}
            <section className="py-12" style={{ backgroundColor: BRAND.cream }}>
                <div className="max-w-5xl mx-auto px-4">
                    <h2 className="text-2xl font-bold mb-6" style={{ color: BRAND.burgundy }}>Consequences of Malpractice</h2>
                    <div className="bg-white rounded-xl overflow-hidden border border-gray-100">
                        <table className="w-full">
                            <thead>
                                <tr style={{ backgroundColor: BRAND.burgundy }}>
                                    <th className="text-left px-6 py-4 text-white font-semibold">Severity</th>
                                    <th className="text-left px-6 py-4 text-white font-semibold">Action</th>
                                    <th className="text-left px-6 py-4 text-white font-semibold hidden md:table-cell">Examples</th>
                                </tr>
                            </thead>
                            <tbody>
                                {consequences.map((row, i) => (
                                    <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                        <td className="px-6 py-4 font-bold" style={{ color: BRAND.burgundy }}>{row.severity}</td>
                                        <td className="px-6 py-4 text-gray-600">{row.action}</td>
                                        <td className="px-6 py-4 text-gray-500 text-sm hidden md:table-cell">{row.examples}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* Reporting */}
            <section className="py-12 text-center">
                <div className="max-w-3xl mx-auto px-4">
                    <AlertTriangle className="w-12 h-12 mx-auto mb-4" style={{ color: BRAND.gold }} />
                    <h2 className="text-2xl font-bold mb-4" style={{ color: BRAND.burgundy }}>
                        Report a Concern
                    </h2>
                    <p className="text-gray-600 mb-6">
                        If you suspect academic malpractice or have concerns about assessment integrity,
                        please report it confidentially to our Academic Integrity Officer.
                    </p>
                    <Link href="/contact">
                        <Button size="lg" style={{ backgroundColor: BRAND.burgundy, color: "white" }}>
                            Contact Integrity Officer
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    );
}
