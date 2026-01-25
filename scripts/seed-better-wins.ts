import prisma from "../src/lib/prisma";

/**
 * Seed compelling, human-like Wins posts for FM community
 * - Varied writing styles
 * - Includes Sarah coach reply
 * - More comments with personality
 * - Rich reactions
 */

// Get or create Coach Sarah
async function getCoachSarah() {
  let sarah = await prisma.user.findFirst({
    where: {
      OR: [
        { email: "sarah@accredipro-certificate.com" },
        { email: "coach@accredipro.academy" },
        { firstName: "Sarah", lastName: "M.", role: "MENTOR" }
      ]
    }
  });

  if (!sarah) {
    sarah = await prisma.user.create({
      data: {
        email: "coach@accredipro.academy",
        firstName: "Sarah",
        lastName: "M.",
        role: "MENTOR",
        avatar: "https://coach.accredipro.academy/wp-content/uploads/2025/10/Sarah-M.webp",
        bio: "Your Functional Medicine Coach",
        isActive: true
      }
    });
  }
  return sarah;
}

// More human, varied writing styles
const WINS_POSTS = [
  {
    title: "omg you guys... MY FIRST CLIENT!!! 😭😭😭",
    content: `ok i literally cannot stop shaking rn

so remember last week when i posted asking if i should just start putting myself out there even tho i dont feel ready??

well... i did it. made a lil post in my neighborhood moms facebook group about how i learned all this stuff about gut health and hormones and if anyone wanted to chat

AND SOMEONE MESSAGED ME. a real human person. she's been dealing with bloating and brain fog for YEARS and her doctor just tells her its stress

we did a 45 min zoom call yesterday and she literally started crying because she said no one has ever actually LISTENED to her about this stuff

she signed up for 3 months. $750.

i know thats not a ton but guys... ITS MY FIRST PAYING CLIENT. someone is paying ME for MY knowledge!!!

6 months ago i was binge watching netflix every night feeling stuck. now look at me.

still dont feel "ready" btw. dont think i ever will lol. but doing it anyway

sending hugs to everyone still in the learning phase. keep going. its so worth it 💕`,
    sarahReply: `OH MY GOSH I AM SO PROUD OF YOU!! 🎉🎉🎉

This is EXACTLY how it starts. You didn't wait until you felt "ready" - you just took the leap. That's the secret most people never figure out.

And $750 is absolutely NOT "not a lot"! That's your first client trusting you with their health journey. That's HUGE.

The fact that she cried because someone finally listened? That's the whole point of what we do. You're already making a real difference.

Can't wait to see where you're at in 6 more months 💛

-Sarah`,
    reactions: { "❤️": 187, "🔥": 94, "👏": 156, "🎉": 203, "💪": 78 },
    comments: [
      { text: "YESSSSS!!! this gave me so much hope!! i literally started tearing up reading this 😭", style: "excited" },
      { text: "The not feeling ready part... that's so real. I keep waiting but maybe I just need to do it too", style: "reflective" },
      { text: "Congrats!! That first one is the hardest. It's all momentum from here 🚀", style: "encouraging" },
      { text: "Girl $750 is amazing for your first client!! Don't downplay that!", style: "supportive" },
      { text: "this is literally my dream. saving this post for when I need motivation", style: "hopeful" },
      { text: "the neighborhood facebook group is genius actually... gonna try that", style: "practical" },
      { text: "I've been sitting on the fence for months. This is my sign to just GO.", style: "decisive" },
      { text: "SO HAPPY FOR YOUUUU 🎊🎊🎊", style: "celebratory" },
    ]
  },
  {
    title: "3 months in, just hit $4200/month 📈",
    content: `Been lurking mostly but felt like I should share because I know how much these success stories helped ME when I was starting.

Background: 48yo, was an OR nurse for 19 years. Burned OUT. Like crying in my car before shifts burned out.

Started the FM journey in October. Got certified in December. Started seeing clients in January.

Here's what actually worked for me:
- Focused on ONE thing (thyroid issues for midlife women) because that's MY story
- Posted consistently on Instagram sharing what I learned, not selling anything
- Did 10 free "practice" sessions with friends of friends to get testimonials
- Priced myself higher than I thought I "should" ($297/session)

This month: 14 paid sessions = $4,158

I still work 2 shifts/week at the hospital because I'm not ready to fully let go of that safety net yet. But I could if I wanted to. That FEELING of having options is everything.

The certification gave me the knowledge. This community gave me the confidence.

Happy to answer any questions if anyone's in the early stages!`,
    sarahReply: `This breakdown is SO valuable - thank you for sharing the actual strategy!

A few things I want to highlight for everyone reading:

1. She picked ONE focus area. Not everything. ONE thing she knows deeply.
2. She did FREE sessions first to build confidence and get testimonials. Smart.
3. She priced HIGHER than felt comfortable. This is key - you attract different clients at different price points.
4. She's keeping her safety net while building. There's no rush to burn bridges.

You went from crying in your car to having OPTIONS. That's what this is all about.

Keep us posted on your journey! 💛`,
    reactions: { "❤️": 245, "🔥": 167, "👏": 198, "🎉": 134, "💪": 112 },
    comments: [
      { text: "This is the detailed breakdown I needed. The free sessions idea is gold - did people know you were practicing?", style: "curious" },
      { text: "Also OR nurse here, also burned out. You're giving me hope there's life after the hospital 🙏", style: "hopeful" },
      { text: "$297/session?! I was thinking of charging like $50. This is shifting my whole mindset", style: "surprised" },
      { text: "The focused niche thing is so hard but I can see why it works. You become THE person for that thing", style: "analytical" },
      { text: "That last line about having options... felt that in my soul. That's the real freedom", style: "deep" },
      { text: "What does a typical session look like for you? Like what do you actually DO?", style: "practical" },
      { text: "19 years is a long time to walk away from. You're brave. And smart.", style: "respectful" },
      { text: "I'm 3 weeks in and this is exactly the motivation I needed today. Screenshot saved! 📱", style: "inspired" },
      { text: "Would love to see your Instagram! Do you share your handle?", style: "curious" },
    ]
  },
  {
    title: "tiny win but... my mom asked for MY advice today",
    content: `this might seem small compared to the amazing client wins in here but I need to share

my mom has had digestive issues my ENTIRE life. she's 71. been to so many doctors. takes so many meds. always complaining about bloating, heartburn, etc.

every time I've tried to talk to her about gut health she waves me off. "i trust my doctor" "youre not a real doctor" you know the drill

well today she called me and said...

"honey, i've been watching you learn all this health stuff and... maybe you could look at my situation? my doctor just wants to add another pill"

I ALMOST DROPPED THE PHONE

we talked for an hour. she actually LISTENED. she's going to try some of the foundational stuff - removing inflammatory foods, adding fermented foods, basics.

I don't have a practice yet. I haven't made any money from this. But if I can help my MOM feel better after 40+ years of suffering?

worth every penny and every late night studying.

the people we love are watching us, even when they act like they aren't 💛`,
    sarahReply: `This is NOT a "tiny win" - this is HUGE.

You know why? Because the people closest to us are often the hardest to reach. They've known us longest, they've seen us try things before, they're skeptical.

When your own family starts coming to YOU for health advice? That's a major shift.

And honestly? These personal wins often matter more than client wins. This is about being able to HELP the people you love most.

I hope your mom starts feeling better. Keep us posted on how she does! 💛`,
    reactions: { "❤️": 312, "🔥": 67, "👏": 145, "🎉": 89, "💪": 78 },
    comments: [
      { text: "this made me cry. my dad is the same way - won't listen to me about anything health related. hoping one day he comes around too", style: "emotional" },
      { text: "NOT a tiny win!! Moms are the toughest critics. If she's listening, you're doing something right", style: "supportive" },
      { text: "\"the people we love are watching us\" - needed to hear this today 😭", style: "touched" },
      { text: "I actually got into this because of my mom too. The personal motivation hits different", style: "relatable" },
      { text: "71 and willing to try something new! That's beautiful. Go mom!", style: "wholesome" },
      { text: "This is the real stuff. Not everything is about money. Sometimes it's about family 💕", style: "values" },
    ]
  },
  {
    title: "QUIT. MY. JOB. TODAY. 🎤⬇️",
    content: `I DID IT.

After 12 years as a medical coder (boring, soulless, fluorescent-lit cube farm existence), I handed in my resignation letter this morning.

MY HANDS WERE SHAKING.

But here's the thing - I've been building this FM practice on the side for 11 months now. Last month I made $6,400. Month before that $5,100.

My salary was $52k/year. I'm now averaging more than that from my SIDE hustle.

So why was I still going to that soul-sucking office every day??

Fear. Pure fear. The comfort of a "stable" paycheck even though I was miserable.

But I realized... there's no amount of stability that's worth spending 40 hours a week wanting to be anywhere else.

My last day is Feb 14th (fitting, because I'm about to fall in love with my new life lol)

To everyone still in the day job you hate: start building on the side. Don't quit until you're ready. But know that the day WILL come when you're ready. And it feels INCREDIBLE.

ahhhhhhhhh I'm a full-time practitioner now what is happening?!?! 🎊`,
    sarahReply: `🎉🎉🎉🎉🎉

CONGRATULATIONS!!!

I'm literally doing a happy dance reading this. You did it the RIGHT way:

✅ Built on the side while employed
✅ Waited until your side income exceeded your salary
✅ Had months of proof it wasn't a fluke
✅ Made the leap from a place of strength, not desperation

This is how it's done, people! ☝️

The fear never fully goes away. You just eventually realize that staying stuck is scarier than taking the leap.

Feb 14th - the day you marry your new life! I love it 💛

Welcome to the full-time practitioner club!`,
    reactions: { "❤️": 398, "🔥": 267, "👏": 312, "🎉": 445, "💪": 189 },
    comments: [
      { text: "CONGRATS!!! This is the dream right here. 11 months from start to quitting - that's amazing", style: "celebratory" },
      { text: "The fact that you were making MORE than your salary and still scared to leave... I get it. Fear is wild.", style: "understanding" },
      { text: "\"soul-sucking office\" I FELT THAT. Currently in my cube reading this dreaming of freedom", style: "relatable" },
      { text: "This is literally my 5 year plan compressed into 11 months 😂 You're inspiring me to move faster", style: "motivated" },
      { text: "I'm saving this whole thread. This is what I needed to see today. IT'S POSSIBLE.", style: "inspired" },
      { text: "The mic drop in the title 💀😂 we love a dramatic exit", style: "funny" },
      { text: "Your coworkers are probably so confused lol \"she's quitting for... health coaching?\"", style: "humorous" },
      { text: "Medical coder to FM practitioner is quite the glow up. Love this journey for you!", style: "supportive" },
      { text: "Feb 14th is perfect 💕 New love story beginning!", style: "romantic" },
      { text: "What was the hardest part about building while working full time? I'm trying to do that now", style: "practical" },
    ]
  },
  {
    title: "Client just texted me this... I'm speechless 🥹",
    content: `Got this text from a client I've been working with for 4 months:

"I just want you to know that you literally changed my life. I had given up on ever feeling normal again. My husband said he has his wife back. My kids said I actually play with them now instead of just watching from the couch. I don't know how to thank you."

You guys.

This woman came to me completely defeated. Chronic fatigue, brain fog, couldn't get through a day without a nap. Doctors said she was fine, just "getting older" (she's 43!!!).

We worked on her gut health, blood sugar, sleep, stress. Nothing revolutionary - just the foundations.

And now? She has her LIFE back.

THIS is why we do this. Not the money (though that helps lol). This. Changing actual lives.

I'm saving this text forever. For the days when imposter syndrome hits hard. For the days when I wonder if I'm making a difference.

We ARE making a difference. Even when it doesn't feel like it. 💛`,
    sarahReply: `Screenshot this. Save it. Print it. Frame it.

Because here's what just happened: you didn't just help one woman. You helped her husband. Her kids. Her whole family dynamic shifted because SHE shifted.

That's the ripple effect of what we do. It's never just one person.

And those texts? Those are your fuel for the hard days. Every practitioner has them saved somewhere.

I'm so proud of you. And I'm proud of your client for doing the work. 💛`,
    reactions: { "❤️": 456, "🔥": 123, "👏": 234, "🎉": 167, "💪": 145 },
    comments: [
      { text: "I'm literally crying at my desk rn 😭😭😭 this is everything", style: "emotional" },
      { text: "\"his wife back\" and \"play with them now\" - the ripple effect is so real. You didn't just help her.", style: "insightful" },
      { text: "43 and doctors saying it's \"aging\"... this is why functional medicine exists. The system is broken.", style: "frustrated" },
      { text: "Saving THIS post for when I have imposter syndrome. Thank you for sharing 💕", style: "grateful" },
      { text: "4 months to transform someone's life. Traditional medicine would have her on pills for 40 years.", style: "contrast" },
      { text: "This is why I started. This is why I keep going. Thank you for the reminder.", style: "reflective" },
      { text: "The foundations!!! Everyone wants a magic pill but it's always the basics done consistently.", style: "wisdom" },
    ]
  },
];

async function main() {
  console.log("Creating better, more human Wins posts...\n");

  const sarah = await getCoachSarah();
  console.log("Coach Sarah ID:", sarah.id);

  // Get zombies with R2 avatars for authors/commenters
  const zombies = await prisma.user.findMany({
    where: {
      isFakeProfile: true,
      avatar: { contains: "r2.dev" }
    },
    select: { id: true, firstName: true, lastName: true },
    take: 200
  });

  const shuffled = [...zombies].sort(() => Math.random() - 0.5);
  console.log(`Found ${shuffled.length} zombies for posts/comments\n`);

  // Get FM wins channel
  const fmWinsChannel = await prisma.communityChannel.findUnique({
    where: { slug: "fm-wins" }
  });

  // Delete my old robotic posts
  const oldPosts = await prisma.communityPost.findMany({
    where: {
      categoryId: "wins",
      author: { isFakeProfile: true },
      title: { contains: "!!" }  // My posts had !! in titles
    },
    select: { id: true }
  });

  if (oldPosts.length > 0) {
    console.log(`Deleting ${oldPosts.length} old posts...`);
    for (const post of oldPosts) {
      await prisma.postComment.deleteMany({ where: { postId: post.id } });
      await prisma.postLike.deleteMany({ where: { postId: post.id } });
      await prisma.communityPost.delete({ where: { id: post.id } });
    }
  }

  // Create new posts
  for (let i = 0; i < WINS_POSTS.length; i++) {
    const postData = WINS_POSTS[i];
    const author = shuffled[i];

    // Random date in last 30 days
    const daysAgo = Math.floor(Math.random() * 25) + 3;
    const createdAt = new Date();
    createdAt.setDate(createdAt.getDate() - daysAgo);

    const post = await prisma.communityPost.create({
      data: {
        title: postData.title,
        content: postData.content,
        categoryId: "wins",
        channelId: fmWinsChannel?.id,
        authorId: author.id,
        isPinned: false,
        viewCount: Math.floor(Math.random() * 500) + 200,
        likeCount: Object.values(postData.reactions).reduce((a, b) => a + b, 0),
        reactions: postData.reactions,
        createdAt,
      }
    });

    console.log(`Created: "${postData.title.substring(0, 40)}..." by ${author.firstName} ${author.lastName}`);

    // Add Sarah's coach reply first
    const sarahReplyDate = new Date(createdAt);
    sarahReplyDate.setHours(sarahReplyDate.getHours() + Math.random() * 4 + 1);

    await prisma.postComment.create({
      data: {
        postId: post.id,
        authorId: sarah.id,
        content: postData.sarahReply,
        createdAt: sarahReplyDate,
        likeCount: Math.floor(Math.random() * 50) + 30,
      }
    });
    console.log("  + Sarah's reply");

    // Add student comments
    const commenters = shuffled.slice(10 + i * 15, 10 + i * 15 + postData.comments.length);

    for (let j = 0; j < postData.comments.length; j++) {
      const commenter = commenters[j] || shuffled[Math.floor(Math.random() * shuffled.length)];
      const commentData = postData.comments[j];

      const commentDate = new Date(createdAt);
      commentDate.setHours(commentDate.getHours() + Math.random() * 48 + 2);

      await prisma.postComment.create({
        data: {
          postId: post.id,
          authorId: commenter.id,
          content: commentData.text,
          createdAt: commentDate,
          likeCount: Math.floor(Math.random() * 20) + 1,
        }
      });
    }
    console.log(`  + ${postData.comments.length} comments\n`);
  }

  console.log("Done! Created 5 better FM Wins posts with Sarah replies.");
}

main().catch(console.error).finally(() => prisma.$disconnect());
