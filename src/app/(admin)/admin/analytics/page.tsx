import { redirect } from "next/navigation";

export const metadata = {
  title: "Analytics | Admin",
  description: "View platform analytics",
};

// Analytics has been consolidated into the main admin dashboard
export default async function AnalyticsPage() {
  redirect("/admin");
}
