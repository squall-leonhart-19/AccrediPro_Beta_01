import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import StudentSupportPortal from "@/components/help/student-support-portal";

export default async function HelpPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  return (
    <div className="animate-fade-in">
      <StudentSupportPortal />
    </div>
  );
}
