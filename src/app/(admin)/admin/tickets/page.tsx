import { redirect } from "next/navigation";

export const metadata = {
  title: "Support Tickets | Admin",
  description: "Manage support tickets",
};

// Redirect to the new full-featured support desk
export default async function TicketsPage() {
  redirect("/support");
}
