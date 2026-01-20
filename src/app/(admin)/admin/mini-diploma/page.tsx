import { redirect } from "next/navigation";

export const metadata = {
  title: "Mini Diploma Analytics | Admin",
  description: "Mini diploma funnel analytics",
};

// Redirect to the combined Leads & Mini Diploma page
export default async function MiniDiplomaPage() {
  redirect("/admin/leads?tab=mini-diploma");
}
