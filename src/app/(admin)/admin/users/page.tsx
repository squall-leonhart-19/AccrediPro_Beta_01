import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { UsersClient } from "@/components/admin/users-client";

async function getCourses() {
  return prisma.course.findMany({
    where: { isPublished: true },
    select: {
      id: true,
      title: true,
      slug: true,
    },
    orderBy: { title: "asc" },
  });
}

export default async function AdminUsersPage() {
  const session = await getServerSession(authOptions);
  if (!session) return null;

  const courses = await getCourses();

  // Users are now fetched client-side with pagination
  return <UsersClient courses={courses} />;
}
