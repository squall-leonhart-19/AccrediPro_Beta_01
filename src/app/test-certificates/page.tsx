import { MiniDiplomaVersions } from "@/components/certificates/mini-diploma-versions";

export default function TestCertificatesPage() {
    return (
        <div className="container mx-auto py-8">
            <h1 className="text-2xl font-bold mb-6">Certificate PDF Version Testing</h1>
            <MiniDiplomaVersions />
        </div>
    );
}
