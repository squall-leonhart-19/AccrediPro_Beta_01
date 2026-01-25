import { redirect } from "next/navigation";

export const metadata = {
  title: "Mini Diploma Analytics | Admin",
  description: "Mini diploma funnel analytics",
};

// Redirect to the unified Lead Intelligence Dashboard
export default async function MiniDiplomaPage() {
  redirect("/admin/leads");
}
