import SequenceHQDashboard from "./sequence-hq-dashboard";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Sequence HQ | Admin",
    description: "Full email sequence management command center",
};

export default function SequenceHQPage() {
    return <SequenceHQDashboard />;
}
