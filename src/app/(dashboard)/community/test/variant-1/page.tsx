import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import PostDetailVariant1 from "@/components/community/variants/post-detail-variant-1";

export default async function Variant1Page() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        redirect("/login");
    }

    const currentUser = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { avatar: true, firstName: true, lastName: true }
    });

    // Mock Post Data
    const mockPost = {
        id: "official-graduation-thread",
        title: "🎓 Officially Certified? Share Your Graduation News Here!",
        content: `To our newest Certified Functional Medicine Practitioners:

**CONGRATULATIONS!** 🎉

You have put in the hours, mastered the material, and proven your dedication to transforming healthcare. We are incredibly proud of you.

**Please share your graduation announcement in a new post in this topic!**

Let us know:
- How it feels to be officially certified
- What you're planning to do next
- A photo of you with your certificate (if you have it printed!)

The entire community is here to celebrate this massive milestone with you. Your journey is just beginning, and we can't wait to see the impact you'll make.

Let's celebrate! 🥂`,
        category: "Graduates",
        isPinned: true,
        viewCount: 5621,
        likeCount: 2030,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        author: {
            id: "coach-sarah",
            firstName: "Sarah",
            lastName: "M.",
            avatar: "/coaches/sarah-coach.webp",
            role: "MENTOR",
        },
    };

    return (
        <PostDetailVariant1
            post={mockPost}
            currentUserId={session.user.id}
            currentUserImage={currentUser?.avatar || session.user.image}
            currentUserFirstName={currentUser?.firstName || session.user.firstName}
            currentUserLastName={currentUser?.lastName || session.user.lastName}
        />
    );
}
