"use client";

import { useState } from "react";
import { Download, FileText, CheckCircle } from "lucide-react";

// All ASI resources - mapping to the new API structure
const RESOURCES = [
    // Core documents
    {
        id: "scope-and-boundaries",
        title: "Professional Scope & Boundaries",
        filename: "Professional-Scope-Boundaries.pdf",
    },
    {
        id: "practice-toolkit",
        title: "Level 0 Practice Toolkit",
        filename: "Level-0-Practice-Toolkit.pdf",
    },
    {
        id: "pathways-guide",
        title: "ASI Certification Pathways Guide",
        filename: "ASI-Certification-Pathways-Guide.pdf",
    },
    // Client resources
    {
        id: "client-intake",
        title: "Client Intake Snapshot",
        filename: "Client-Intake-Snapshot.pdf",
    },
    {
        id: "clarity-map",
        title: "Client Clarity Map",
        filename: "Client-Clarity-Map.pdf",
    },
    {
        id: "support-circle",
        title: "Support Circle Builder",
        filename: "Support-Circle-Builder.pdf",
    },
    {
        id: "goals-translation",
        title: "Goals Translation Sheet",
        filename: "Goals-Translation-Sheet.pdf",
    },
    {
        id: "readiness-check",
        title: "Readiness for Support Check",
        filename: "Readiness-for-Support-Check.pdf",
    },
    {
        id: "reflection-card",
        title: "Between-Sessions Reflection Card",
        filename: "Between-Sessions-Reflection-Card.pdf",
    },
];

function ResourceCard({ resource }: { resource: typeof RESOURCES[0] }) {
    const [clicked, setClicked] = useState(false);

    // NEW: URL with filename in the path for Safari compatibility
    // Safari uses URL path as filename, ignoring Content-Disposition
    const downloadUrl = `/api/mini-diploma/resources/pdf/${resource.id}/${resource.filename}`;

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                    <h3 className="font-medium text-gray-900">{resource.title}</h3>
                    <p className="text-xs text-gray-500 font-mono">{resource.filename}</p>
                </div>
            </div>
            <a
                href={downloadUrl}
                onClick={() => setClicked(true)}
                className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-all ${clicked
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-amber-500 text-white hover:bg-amber-600"
                    }`}
            >
                {clicked ? <CheckCircle className="w-4 h-4" /> : <Download className="w-4 h-4" />}
                {clicked ? "Downloaded!" : "Download PDF"}
            </a>
        </div>
    );
}

export default function TestPdfsPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white py-12 px-4">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        📄 PDF Download Test Page
                    </h1>
                    <p className="text-gray-600">
                        Filename is now in the URL path for Safari compatibility
                    </p>
                </div>

                <div className="space-y-3">
                    <h2 className="text-lg font-semibold text-gray-700 mb-2">Core Documents</h2>
                    {RESOURCES.slice(0, 3).map(resource => (
                        <ResourceCard key={resource.id} resource={resource} />
                    ))}

                    <h2 className="text-lg font-semibold text-gray-700 mt-6 mb-2">Client Resources</h2>
                    {RESOURCES.slice(3).map(resource => (
                        <ResourceCard key={resource.id} resource={resource} />
                    ))}
                </div>

                <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h3 className="font-medium text-blue-900 mb-2">Safari Fix:</h3>
                    <ul className="text-sm text-blue-800 space-y-1">
                        <li>✓ URL now ends with the filename: <code>/api/.../scope-and-boundaries/Professional-Scope-Boundaries.pdf</code></li>
                        <li>✓ Safari uses URL path as filename, so now it will work!</li>
                        <li>✓ Check your Downloads folder</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
