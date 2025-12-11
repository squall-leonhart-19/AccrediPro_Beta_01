import { redirect } from "next/navigation";

// Redirect /admin/analytics to /admin/settings
export default function AdminAnalyticsPage() {
    redirect("/admin/settings");
}
