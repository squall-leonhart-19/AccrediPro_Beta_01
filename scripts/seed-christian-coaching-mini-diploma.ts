import { PrismaClient, CertificateType, LessonType } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log("Seeding Christian Coaching Mini Diploma...");

    // Get or create the christian-coaching category
    let category = await prisma.category.findFirst({
        where: { slug: "christian-coaching" },
    });

    if (!category) {
        category = await prisma.category.create({
            data: {
                name: "Christian Coaching",
                slug: "christian-coaching",
                description: "Faith-based life coaching certification programs",
            },
        });
        console.log("Created category:", category.name);
    }

    // Get coach Sarah
    let coach = await prisma.user.findFirst({
        where: {
            OR: [
                { email: "sarah_womenhealth@accredipro-certificate.com" },
                { email: "admin@accredipro-certificate.com" },
            ],
        },
    });

    // Check if course already exists
    const existingCourse = await prisma.course.findFirst({
        where: { slug: "christian-coaching-mini-diploma" },
    });

    if (existingCourse) {
        console.log("Christian Coaching Mini Diploma already exists. Skipping...");
        console.log(`Course ID: ${existingCourse.id}`);
        return;
    }

    // Create the course with 9 lessons (lesson content as simple HTML for now)
    const course = await prisma.course.create({
        data: {
            title: "Christian Life Coaching Mini Diploma",
            slug: "christian-coaching-mini-diploma",
            description:
                "Discover how to turn your faith into a calling that transforms lives. This free mini diploma introduces the foundations of Christian life coaching, biblical principles for helping others, and shows you how to build a practice rooted in purpose. Complete all 9 lessons and pass the final exam to earn your ASI-Verified Certificate.",
            thumbnail: "/images/courses/christian-coaching-mini-diploma-thumb.jpg",
            price: 0,
            isPublished: true,
            isFeatured: false,
            certificateType: CertificateType.MINI_DIPLOMA,
            categoryId: category.id,
            coachId: coach?.id,
            modules: {
                create: [
                    {
                        title: "Welcome & Foundation",
                        description: "Introduction to Christian life coaching and your calling",
                        order: 0,
                        isPublished: true,
                        lessons: {
                            create: [
                                {
                                    title: "Lesson 1: The Coaching Mindset",
                                    description: "Understand the difference between coaching, counseling, and mentoring through a faith-based lens.",
                                    content: `<div class="lesson-content">
<h1>Lesson 1: The Coaching Mindset</h1>
<p>Welcome to your Christian Life Coaching Mini Diploma! I'm Sarah, and I'm so excited to walk with you on this journey.</p>

<h2>What is Christian Life Coaching?</h2>
<p>Christian life coaching is a calling to help others discover God's purpose for their lives. It's different from counseling (which looks backward at wounds) and different from mentoring (which says "do what I did").</p>

<p><strong>Coaching asks:</strong> "What does God want FOR you, and how can we partner to get you there?"</p>

<h2>The Biblical Foundation</h2>
<p>"Plans fail for lack of counsel, but with many advisers they succeed." - Proverbs 15:22</p>

<p>As coaches, we become those trusted advisers who help people align their plans with God's purpose.</p>

<h2>Your Role as a Coach</h2>
<ul>
<li>Ask powerful questions that unlock insight</li>
<li>Listen deeply with compassion</li>
<li>Hold space for transformation</li>
<li>Point people back to God's truth</li>
</ul>

<p>In the next lesson, we'll dive into the most important skill: active listening.</p>
</div>`,
                                    lessonType: LessonType.TEXT,
                                    order: 0,
                                    isPublished: true,
                                    isFreePreview: true,
                                },
                                {
                                    title: "Lesson 2: Active Listening",
                                    description: "Learn to listen like Jesus did - with presence, compassion, and intention.",
                                    content: `<div class="lesson-content">
<h1>Lesson 2: Active Listening</h1>

<h2>How Jesus Listened</h2>
<p>Notice how Jesus never rushed. He asked questions. He was fully present. He listened not just to words, but to the heart behind them.</p>

<p>"The woman at the well didn't need a lecture - she needed someone to truly SEE her."</p>

<h2>The HEAR Framework</h2>
<ul>
<li><strong>H</strong>old space - Create a judgment-free zone</li>
<li><strong>E</strong>cho back - Reflect what you hear</li>
<li><strong>A</strong>sk deeper - Go beneath the surface</li>
<li><strong>R</strong>espond with truth - Speak God's perspective</li>
</ul>

<h2>Practice Exercise</h2>
<p>This week, practice listening to someone for 5 minutes without interrupting, advising, or fixing. Just listen. See what happens.</p>
</div>`,
                                    lessonType: LessonType.TEXT,
                                    order: 1,
                                    isPublished: true,
                                    isFreePreview: false,
                                },
                                {
                                    title: "Lesson 3: Powerful Questions",
                                    description: "Master the art of asking questions that open hearts and minds.",
                                    content: `<div class="lesson-content">
<h1>Lesson 3: Powerful Questions</h1>

<h2>Questions Jesus Asked</h2>
<p>Jesus asked over 300 questions in the Gospels. He didn't just tell people what to do - he helped them discover truth for themselves.</p>

<blockquote>"What do you want me to do for you?" - Jesus to Bartimaeus</blockquote>

<h2>Types of Powerful Questions</h2>
<ul>
<li><strong>Vision Questions:</strong> "What would your life look like if you fully trusted God in this area?"</li>
<li><strong>Values Questions:</strong> "What matters most to you about this decision?"</li>
<li><strong>Action Questions:</strong> "What's one step you could take this week?"</li>
<li><strong>Belief Questions:</strong> "What does God's Word say about this?"</li>
</ul>

<h2>The Golden Rule of Questions</h2>
<p>The best questions are OPEN-ENDED. They start with What, How, or Tell me more...</p>

<p>Avoid "why" questions (they can feel accusatory) and yes/no questions (they close conversation).</p>
</div>`,
                                    lessonType: LessonType.TEXT,
                                    order: 2,
                                    isPublished: true,
                                    isFreePreview: false,
                                },
                            ],
                        },
                    },
                    {
                        title: "The Faith Framework",
                        description: "Biblical principles and coaching tools for Christian coaches",
                        order: 1,
                        isPublished: true,
                        lessons: {
                            create: [
                                {
                                    title: "Lesson 4: The FAITH Framework",
                                    description: "A biblical coaching framework for guiding clients toward breakthrough.",
                                    content: `<div class="lesson-content">
<h1>Lesson 4: The FAITH Framework</h1>

<h2>Your Signature Coaching Model</h2>
<p>Every great coach needs a framework. Here's one built on biblical principles:</p>

<h2>F.A.I.T.H.</h2>
<ul>
<li><strong>F</strong>ocus - Define the goal with clarity</li>
<li><strong>A</strong>wareness - Understand current reality</li>
<li><strong>I</strong>dentify - Spot obstacles and beliefs</li>
<li><strong>T</strong>ransform - Renew the mind with truth</li>
<li><strong>H</strong>arvest - Take action and celebrate wins</li>
</ul>

<h2>Using the Framework</h2>
<p>"Do not conform to the pattern of this world, but be transformed by the renewing of your mind." - Romans 12:2</p>

<p>This framework mirrors the transformation process Paul describes. Your clients don't need more information - they need transformation.</p>
</div>`,
                                    lessonType: LessonType.TEXT,
                                    order: 0,
                                    isPublished: true,
                                    isFreePreview: false,
                                },
                                {
                                    title: "Lesson 5: Goal Setting with God",
                                    description: "Help clients set goals that align with God's purpose for their lives.",
                                    content: `<div class="lesson-content">
<h1>Lesson 5: Goal Setting with God</h1>

<h2>Beyond SMART Goals</h2>
<p>The world teaches SMART goals. As Christian coaches, we add a spiritual dimension.</p>

<h2>Kingdom Goal Setting</h2>
<ol>
<li><strong>Seek first:</strong> Is this goal aligned with God's will?</li>
<li><strong>Surrender:</strong> Am I willing to let God redirect?</li>
<li><strong>Stewardship:</strong> Am I using my gifts wisely?</li>
<li><strong>Service:</strong> How does this bless others?</li>
<li><strong>Sustainability:</strong> Is this honoring to my body, family, and calling?</li>
</ol>

<h2>Practical Application</h2>
<p>Help your clients pray over their goals. Ask: "Have you invited God into this decision?" The answer often brings clarity no coaching question can.</p>
</div>`,
                                    lessonType: LessonType.TEXT,
                                    order: 1,
                                    isPublished: true,
                                    isFreePreview: false,
                                },
                                {
                                    title: "Lesson 6: Overcoming Obstacles",
                                    description: "Biblical strategies for helping clients break through barriers.",
                                    content: `<div class="lesson-content">
<h1>Lesson 6: Overcoming Obstacles</h1>

<h2>The Real Barriers</h2>
<p>Most obstacles aren't external - they're internal:</p>
<ul>
<li>Fear of failure</li>
<li>Unworthiness</li>
<li>Past wounds</li>
<li>Limiting beliefs</li>
</ul>

<h2>The Power of Identity</h2>
<p>Your clients need to know who they are IN CHRIST before they can step into who they're becoming.</p>

<blockquote>"For we are God's handiwork, created in Christ Jesus to do good works, which God prepared in advance for us to do." - Ephesians 2:10</blockquote>

<h2>Coaching Through Obstacles</h2>
<ol>
<li>Name the fear or belief</li>
<li>Trace it back - where did it come from?</li>
<li>Replace it with truth from Scripture</li>
<li>Create a new action that reinforces the new belief</li>
</ol>
</div>`,
                                    lessonType: LessonType.TEXT,
                                    order: 2,
                                    isPublished: true,
                                    isFreePreview: false,
                                },
                            ],
                        },
                    },
                    {
                        title: "Building Your Practice",
                        description: "Turning your calling into a thriving coaching practice",
                        order: 2,
                        isPublished: true,
                        lessons: {
                            create: [
                                {
                                    title: "Lesson 7: Finding Your Niche",
                                    description: "Discover who God is calling you to serve.",
                                    content: `<div class="lesson-content">
<h1>Lesson 7: Finding Your Niche</h1>

<h2>Your Calling is Specific</h2>
<p>God didn't call you to help everyone. He called you to help SOMEONE specific - and your story holds the clue.</p>

<h2>Niche Discovery Questions</h2>
<ul>
<li>What pain have you walked through and overcome?</li>
<li>What transformation has God worked in YOUR life?</li>
<li>Who do you naturally attract?</li>
<li>What problems can you solve in your sleep?</li>
</ul>

<h2>Popular Christian Coaching Niches</h2>
<ul>
<li>Marriage and relationship coaching</li>
<li>Career transition and purpose</li>
<li>Single mothers</li>
<li>Women in ministry</li>
<li>Faith and business integration</li>
<li>Grief and life transitions</li>
</ul>

<p>Your mess becomes your message. Your test becomes your testimony.</p>
</div>`,
                                    lessonType: LessonType.TEXT,
                                    order: 0,
                                    isPublished: true,
                                    isFreePreview: false,
                                },
                                {
                                    title: "Lesson 8: Pricing Your Services",
                                    description: "Set prices that honor your calling AND pay your bills.",
                                    content: `<div class="lesson-content">
<h1>Lesson 8: Pricing Your Services</h1>

<h2>The Money Conversation</h2>
<p>Many Christian coaches struggle with charging for their gifts. Let's address this directly.</p>

<blockquote>"The worker deserves his wages." - 1 Timothy 5:18</blockquote>

<h2>Why Charging Matters</h2>
<ul>
<li>Clients invest more when they pay more</li>
<li>Free coaching often isn't valued</li>
<li>You can't serve from an empty cup</li>
<li>Your family needs provision</li>
</ul>

<h2>Pricing Framework</h2>
<ul>
<li><strong>Session Rate:</strong> $100-250/session for certified coaches</li>
<li><strong>Package Rate:</strong> $997-2,500 for 3-month programs</li>
<li><strong>Premium:</strong> $3,000-5,000 for 6-month transformation programs</li>
</ul>

<p>Start where you're comfortable, but know that undercharging can actually HURT your clients' commitment.</p>
</div>`,
                                    lessonType: LessonType.TEXT,
                                    order: 1,
                                    isPublished: true,
                                    isFreePreview: false,
                                },
                                {
                                    title: "Lesson 9: Your Next Steps",
                                    description: "Your path forward to becoming a Certified Christian Life Coach.",
                                    content: `<div class="lesson-content">
<h1>Lesson 9: Your Next Steps</h1>

<h2>Congratulations!</h2>
<p>You've completed the Christian Life Coaching Mini Diploma! You now understand:</p>
<ul>
<li>The coaching mindset</li>
<li>Active listening skills</li>
<li>Powerful questioning techniques</li>
<li>The FAITH Framework</li>
<li>Goal setting and obstacle removal</li>
<li>Niche selection and pricing</li>
</ul>

<h2>What's Next?</h2>
<p>This mini diploma gave you the foundation. But to truly serve clients with confidence, you need:</p>
<ul>
<li>Official Board Certification</li>
<li>Deeper training in coaching methodology</li>
<li>Practice with real clients (supervised)</li>
<li>Business and marketing skills</li>
</ul>

<h2>Board Certification</h2>
<p>Because you completed this Mini Diploma, you qualify for Sarah's Board Certification Scholarship.</p>

<p>This includes:</p>
<ul>
<li>Full 12-module certification program</li>
<li>1-on-1 mentorship with Sarah until you're certified</li>
<li>Done-for-you website</li>
<li>Client acquisition training</li>
<li>ASI Board Certification and directory listing</li>
</ul>

<p><strong>Complete the exam below to claim your Mini Diploma certificate and see the scholarship offer.</strong></p>
</div>`,
                                    lessonType: LessonType.TEXT,
                                    order: 2,
                                    isPublished: true,
                                    isFreePreview: false,
                                },
                            ],
                        },
                    },
                ],
            },
        },
        include: {
            modules: {
                include: {
                    lessons: true,
                },
            },
        },
    });

    console.log(`\n✅ Created course: ${course.title}`);
    console.log(`   Course ID: ${course.id}`);
    console.log(`   Slug: ${course.slug}`);
    console.log(`   Modules: ${course.modules.length}`);

    let totalLessons = 0;
    for (const mod of course.modules) {
        console.log(`   - ${mod.title}: ${mod.lessons.length} lessons`);
        totalLessons += mod.lessons.length;
    }
    console.log(`   Total Lessons: ${totalLessons}`);

    console.log("\n🎉 Christian Coaching Mini Diploma seeding complete!");
}

main()
    .catch((e) => {
        console.error("Error:", e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
