import prisma from "../src/lib/prisma";

/**
 * Seed 4-5 compelling Wins posts for Functional Medicine community
 * These are realistic success stories that inspire and convert
 */

const FM_WINS_POSTS = [
  {
    title: "Got my FIRST paying client today!! 🎉",
    content: `I cannot believe I'm writing this but I just signed my FIRST paying client today and I'm literally shaking!

She found me through a post I made in a local Facebook group about gut health (just sharing what I learned in Module 3). She messaged me asking if I could help her daughter who's been struggling with bloating and fatigue for years.

We did a 30-minute discovery call and she said YES to a 3-month package for $897!!

I know that might not sound like a lot to some of you, but 6 months ago I was working 60-hour weeks as a corporate accountant, miserable and unfulfilled. Now I'm actually helping someone heal AND getting paid for it.

Sarah, thank you for believing in me when I didn't believe in myself. And to everyone still in the learning phase - KEEP GOING. It happens faster than you think once you start putting yourself out there. 💛`,
    reactions: { "❤️": 47, "🔥": 32, "👏": 28, "🎉": 45, "💪": 19 },
    viewCount: 234,
    likeCount: 171,
  },
  {
    title: "Just hit $3,000/month - 8 months in! 😭",
    content: `I had to share this because I need to pinch myself.

When I started this journey, I was a burnt-out ER nurse of 22 years. I was so skeptical that this could actually replace my income. My husband thought I was crazy for investing in myself.

Well... this month I just hit $3,000 in my functional medicine practice. WORKING PART-TIME. On MY schedule. From HOME.

My clients are mostly women 40-55 dealing with:
- Thyroid issues (that's my specialty because of my own Hashimoto's)
- Perimenopause symptoms
- Fatigue that doctors couldn't explain

The crazy part? I still have my nursing job 2 days a week because I'm not quite ready to fully let go. But at this rate, I'll be fully transitioned by summer.

For anyone on the fence: you CAN do this. The training is incredible. The community support is real. And the feeling of actually HELPING people heal instead of just putting bandaids on symptoms? Priceless.

Thank you Sarah and everyone here. You changed my life. 💕`,
    reactions: { "❤️": 89, "🔥": 56, "👏": 67, "🎉": 43, "💪": 38 },
    viewCount: 567,
    likeCount: 293,
  },
  {
    title: "Client told me today: 'You saved my marriage'",
    content: `Had to share this because I'm still crying.

One of my clients - let's call her Jen - came to me 4 months ago completely depleted. No energy, brain fog, mood swings that were affecting her relationship, doctors just kept giving her antidepressants.

We worked on her gut health, balanced her blood sugar, supported her hormones naturally. Nothing crazy - just the fundamentals we learned in the program.

Today on our call, she told me her husband said: "I have my wife back."

She broke down crying. I broke down crying.

THIS is why I left my corporate marketing job. THIS is what all those late nights studying were for. THIS is the impact I wanted to make.

I only have 6 clients right now. I'm still learning. I don't have all the answers. But I SHOWED UP for her, I LISTENED, and I helped her find the root cause.

If you're doubting yourself today, remember: you don't need to be perfect. You just need to care deeply and apply what you're learning. That's enough. 💛`,
    reactions: { "❤️": 124, "🔥": 41, "👏": 78, "🎉": 29, "💪": 52 },
    viewCount: 432,
    likeCount: 324,
  },
  {
    title: "Quit my nursing job today. No regrets. 🙌",
    content: `It's official. After 16 years in healthcare, I handed in my resignation this morning.

Here's my timeline for anyone curious:
- Started the Mini Diploma: January
- Got certified: April
- First client: May
- $2K month: July
- $5K month: October
- TODAY: $6K booked for December and I finally had the courage to quit

The craziest part? I'm working LESS hours than I did as a nurse and making MORE money. And I actually LOVE what I do.

My niche is helping nurses and healthcare workers heal from burnout and chronic stress. Ironic, right? But I GET them. I was them. I know exactly what they're going through.

If you're still in healthcare and feeling trapped, please know there's another way. You can use everything you learned AND actually enjoy your work again.

Big scary leap but I'm so ready. Thank you to this incredible community for all the support! 🥹`,
    reactions: { "❤️": 156, "🔥": 89, "👏": 112, "🎉": 78, "💪": 67 },
    viewCount: 823,
    likeCount: 502,
  },
  {
    title: "Small win: My mom finally took my advice! 🥲",
    content: `This might seem small compared to other wins here, but it's HUGE for me.

My mom has had Type 2 diabetes for 15 years. Every time I've tried to talk to her about nutrition or lifestyle changes, she'd wave me off: "The doctor said I just need my medication."

Well, yesterday she called me and said: "I've been watching you learn all this stuff, and I want to try what you're suggesting."

I almost dropped the phone.

We spent 2 hours going over simple changes:
- Protein and fat with every meal
- Walking after dinner
- Better sleep routine
- The blood sugar basics from Module 2

She's going to track her glucose for 2 weeks and we'll adjust together.

I don't have a practice yet. I haven't made any money from this. But if this helps my mom even a little bit... worth every penny and every hour I've invested.

Sometimes the biggest wins aren't about clients or income. They're about finally being able to help the people you love. ❤️`,
    reactions: { "❤️": 201, "🔥": 45, "👏": 89, "🎉": 34, "💪": 56 },
    viewCount: 456,
    likeCount: 425,
  },
];

// Comments for each post - will be added by random zombies
const WIN_COMMENTS = [
  // Comments for first client post
  [
    "This is AMAZING!! So proud of you! 🎉 That first client feeling is the BEST!",
    "You did it!! The first one is the hardest - it's only up from here!",
    "So inspiring! I'm about 2 weeks behind you and this gives me so much hope!",
    "YESSSS! This made my whole day! You deserve this so much! 💕",
    "The local Facebook group strategy is genius - I'm trying that this week!",
    "Can't wait to be posting my first client win soon. You go girl!!",
    "This is why I love this community. Real people, real results. Congrats! 🙌",
  ],
  // Comments for $3K month post
  [
    "This gave me chills reading it. Thank you for sharing your journey! 🥹",
    "Fellow nurse here (ICU, 18 years). You're giving me hope I can do this too.",
    "The thyroid specialty is so smart! There's such a need for practitioners who actually understand it.",
    "Part-time and making $3K?! That's incredible. This is my goal by next year!",
    "Your husband must be so proud now! Mine was skeptical too at first.",
    "This is the motivation I needed today. Thank you for being so real about your journey. 💛",
    "Saving this post to read when I have doubting days. You're amazing!",
    "Girl, by summer you'll probably be at $6K. The momentum is REAL once it starts!",
  ],
  // Comments for 'saved my marriage' post
  [
    "I'm crying at my desk right now. THIS is the work. THIS is why we do it. 😭",
    "The ripple effect of what we do is so much bigger than just the client. You helped a whole family.",
    "This is beautiful. Thank you for sharing. We need these reminders of the impact.",
    "Not gonna lie, this made me tear up. What a gift you gave her.",
    "You didn't just help HER - you helped her husband, probably her kids, her whole circle. Amazing.",
    "This is exactly why I left my 9-5. I wanted to make a REAL difference. You're doing it! 💕",
  ],
  // Comments for quit job post
  [
    "CONGRATULATIONS!! 🎉🎉🎉 This is absolutely incredible! So happy for you!",
    "The timeline is SO helpful - thank you for breaking it down like that!",
    "Nurses helping nurses heal from burnout - that is such a needed niche. Brilliant.",
    "I'm a nurse too and this is my dream. You just proved it's possible. Thank you! 🙏",
    "$6K/month and working less?? This is the dream. You're living it!",
    "So inspiring! That took real courage. Wishing you all the success! 💪",
    "This is what I want to be posting in a year. Saved for motivation!",
    "The fact that you get to help OTHER nurses escape is just *chef's kiss*",
    "Your last day must have felt SO good! Congrats on betting on yourself! 🥳",
  ],
  // Comments for mom post
  [
    "This is the sweetest win I've read all week. 🥹 Family believing in us hits different.",
    "Not a 'small' win at all - this is HUGE! Helping family is why many of us started.",
    "The fact that she watched you learning and that inspired her... you're already making an impact!",
    "This is beautiful. I hope I can help my dad the same way someday. 💕",
    "Sometimes the 'money wins' get all the attention but THIS is the real stuff.",
    "Module 2 blood sugar content is SO good. Your mom is in great hands!",
    "Crying. This is why I'm here. Thank you for sharing. ❤️",
    "You might not have clients yet but you're already a practitioner where it matters most.",
  ],
];

async function main() {
  console.log("Seeding FM Wins posts...\n");

  // Get random fake profiles to use as authors
  const zombies = await prisma.user.findMany({
    where: { isFakeProfile: true },
    select: { id: true, firstName: true, lastName: true },
    take: 200,
  });

  if (zombies.length < 50) {
    throw new Error("Not enough fake profiles! Need at least 50.");
  }

  // Shuffle zombies
  const shuffled = [...zombies].sort(() => Math.random() - 0.5);

  // Get the fm-wins channel
  const fmWinsChannel = await prisma.communityChannel.findUnique({
    where: { slug: "fm-wins" },
  });

  // Get FM community if it exists
  const fmCommunity = await prisma.categoryCommunity.findFirst({
    where: { category: { slug: "functional-medicine" } },
  });

  console.log("FM Wins channel:", fmWinsChannel?.id || "not found");
  console.log("FM Community:", fmCommunity?.id || "not found");

  // Create each wins post
  for (let i = 0; i < FM_WINS_POSTS.length; i++) {
    const postData = FM_WINS_POSTS[i];
    const author = shuffled[i]; // Use different zombie for each post
    const comments = WIN_COMMENTS[i];

    // Create post with random date in last 30 days
    const daysAgo = Math.floor(Math.random() * 25) + 3; // 3-28 days ago
    const createdAt = new Date();
    createdAt.setDate(createdAt.getDate() - daysAgo);

    const post = await prisma.communityPost.create({
      data: {
        title: postData.title,
        content: postData.content,
        categoryId: "wins",
        channelId: fmWinsChannel?.id,
        communityId: fmCommunity?.id,
        authorId: author.id,
        isPinned: false,
        isLocked: false,
        viewCount: postData.viewCount,
        likeCount: postData.likeCount,
        reactions: postData.reactions,
        createdAt,
      },
    });

    console.log(`Created post: "${postData.title}" by ${author.firstName} ${author.lastName}`);

    // Add comments from random zombies
    const commentAuthors = shuffled.slice(
      FM_WINS_POSTS.length + i * 10,
      FM_WINS_POSTS.length + i * 10 + comments.length
    );

    for (let j = 0; j < comments.length; j++) {
      const commentAuthor = commentAuthors[j] || shuffled[Math.floor(Math.random() * shuffled.length)];

      // Comment created 0-3 days after post
      const commentDaysAfter = Math.random() * 3;
      const commentCreatedAt = new Date(createdAt);
      commentCreatedAt.setDate(commentCreatedAt.getDate() + commentDaysAfter);

      await prisma.postComment.create({
        data: {
          postId: post.id,
          authorId: commentAuthor.id,
          content: comments[j],
          createdAt: commentCreatedAt,
          likeCount: Math.floor(Math.random() * 15) + 1,
        },
      });
    }

    console.log(`  Added ${comments.length} comments\n`);
  }

  console.log("Done! Created 5 FM Wins posts with comments.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
