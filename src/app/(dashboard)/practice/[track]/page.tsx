import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import TrackPageClient from "./track-page-client";

export const dynamic = "force-dynamic";

// Valid track slugs
const VALID_TRACKS = [
    "functional-medicine",
    "holistic-nutrition",
    "narc-recovery",
    "life-coach",
    "parenting",
    "energy-healing",
];

interface Props {
    params: Promise<{ track: string }>;
}

export default async function TrackPage({ params }: Props) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        redirect("/login");
    }

    const { track } = await params;

    if (!VALID_TRACKS.includes(track)) {
        notFound();
    }

    return <TrackPageClient trackSlug={track} />;
}

// Generate static params for all tracks
export async function generateStaticParams() {
    return VALID_TRACKS.map((track) => ({ track }));
}
