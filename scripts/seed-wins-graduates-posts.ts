/**
 * Seed Script: Create Share Your Wins and New Graduates posts with zombie profiles
 *
 * This script creates:
 * - 10 "Share Your Wins" posts with authentic storytelling
 * - 10 "New Graduates" posts celebrating certification achievements
 *
 * All posts use zombie profiles (fake profiles) for social proof.
 * All stories mention Coach Sarah, the program, and certification benefits.
 *
 * Run with: npx tsx scripts/seed-wins-graduates-posts.ts
 */

import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';

// Prisma 7 requires driver adapters
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// Zombie profile avatars (female professional photos)
const ZOMBIE_AVATARS = [
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1499952127939-9bbf5af6c51c?w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1546961342-ea1f71b193f8?w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1598550874175-4d0ef436c909?w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1548142813-c348350df52b?w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1557862921-37829c790f19?w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
];

// "Share Your Wins" posts - Natural storytelling with proper formatting
const WINS_POSTS = [
  {
    authorName: { first: "Jennifer", last: "Thompson" },
    avatar: ZOMBIE_AVATARS[0],
    title: "Just signed my FIRST paying client! I'm literally crying right now 😭",
    content: `<p>You guys... I have to share this because I honestly can't believe it.</p>

<p>Three months ago I was burned out after 25 years as an ER nurse, wondering if I'd made a huge mistake leaving my "stable" job. My husband thought I was crazy, my kids didn't understand why mom was always studying instead of watching TV with them.</p>

<p>I messaged <strong>Coach Sarah</strong> at 2am one night, completely overwhelmed. She called me the NEXT MORNING and spent an hour walking me through my first discovery call script. She even role-played with me!</p>

<p>This morning, after a discovery call with a woman from my church who's been struggling with chronic fatigue for years... <strong>she said YES.</strong></p>

<p>$1,200 for a 3-month package.</p>

<p>I'm sitting in my car crying as I write this because it feels SO REAL now.</p>

<p>The program taught me:</p>
<ul>
<li>How to actually read labs (not just "normal" vs "abnormal")</li>
<li>The gut-hormone connection I never learned in nursing school</li>
<li>How to structure a discovery call that converts</li>
<li>How to price my services confidently</li>
</ul>

<p>To everyone just starting out or feeling like giving up - DON'T. Your person is out there waiting for you.</p>

<p>Thank you Sarah and this community for believing in me when I didn't believe in myself 💕</p>`,
    viewCount: 3847,
    daysAgo: 3,
  },
  {
    authorName: { first: "Amanda", last: "Foster" },
    avatar: ZOMBIE_AVATARS[5],
    title: "From $0 to $4,800/month in 5 months - here's EXACTLY what worked",
    content: `<p>I promised myself I'd share my journey once I hit consistent income, and this month I finally did it:</p>

<p><strong>$4,800 in revenue with 8 active clients.</strong></p>

<p>Real talk: The first 2 months were brutal. I posted on social media every day, got like 12 likes from my mom and two friends. Had discovery calls where people said "I'll think about it" (they never called back).</p>

<p>What changed EVERYTHING was a voice message from Sarah after I posted in here about wanting to quit.</p>

<p>She said: <em>"Amanda, you're trying to help everyone. Pick ONE person with ONE problem that YOU understand deeply."</em></p>

<p>That hit me like a ton of bricks.</p>

<p><strong>What I changed:</strong></p>
<ol>
<li><strong>Picked ONE problem.</strong> I specialize in helping women with lupus manage their symptoms naturally. Why? Because I have lupus myself. My story became my marketing.</li>
<li><strong>Stopped trying to look "professional."</strong> I started being real, messy, vulnerable. My best-performing post was me crying in my car about a flare-up.</li>
<li><strong>Used the Business Launch Kit.</strong> The templates for onboarding saved me HOURS. I customized them for autoimmune clients.</li>
<li><strong>Followed up like my business depended on it.</strong> Because it does. 6 of my 8 clients came from follow-up messages.</li>
</ol>

<p>The certification gave me the knowledge. The program gave me the business skills. Sarah gave me the confidence.</p>

<p>To anyone in months 1-3 feeling like nothing is working: it's working. You just can't see it yet. Keep going.</p>

<p>Happy to answer any questions! 🙏</p>`,
    viewCount: 5234,
    daysAgo: 7,
  },
  {
    authorName: { first: "Victoria", last: "Hayes" },
    avatar: ZOMBIE_AVATARS[3],
    title: "I quit my hospital job today. My hands are literally shaking as I type this.",
    content: `<p>I walked into HR this morning and handed in my resignation letter.</p>

<p>12 years as a Med-Surg nurse. Gone.</p>

<p>My manager looked at me like I'd lost my mind. "You're leaving for... health coaching?" she said with that tone we all know too well.</p>

<p>What she doesn't know:</p>
<ul>
<li>I've already replaced my nursing income ($6,400 last month)</li>
<li>I work from home in my pajamas</li>
<li>I actually HELP people get BETTER instead of just managing their pills</li>
<li>My Hashimoto's is finally under control because I'm not killing myself with 12-hour shifts</li>
</ul>

<p>The craziest part? I started this certification just wanting to understand my own thyroid issues better. Never thought I'd actually build a business.</p>

<p>But Sarah saw something in me I didn't see in myself.</p>

<p>When I told her I was "just a nurse" who didn't know anything about business, she said:</p>

<p><em>"Victoria, you've been running a mini business for 12 years. Every shift you prioritize, delegate, problem-solve under pressure, and communicate with difficult people. You're more prepared than you think."</em></p>

<p>She was right.</p>

<p>The program taught me the clinical knowledge. The community taught me the business. Sarah taught me to believe in myself.</p>

<p>My last nursing shift is December 20th. Christmas gift to myself. 🎄</p>

<p>If there's anyone here still on the fence, working nights, coming home too exhausted to spend time with your family... there IS another way. I'm living proof.</p>`,
    viewCount: 4567,
    daysAgo: 12,
  },
  {
    authorName: { first: "Lisa", last: "Martinez" },
    avatar: ZOMBIE_AVATARS[6],
    title: "Had my first client SUCCESS story and I ugly cried for 20 minutes",
    content: `<p>When I started working with Maria 3 months ago, she could barely get out of bed.</p>

<p>Chronic fatigue. Brain fog. 47 years old and feeling like 87.</p>

<p>She'd been to 6 doctors. They all told her "your labs look fine" and handed her antidepressants.</p>

<p>Sound familiar? It should. Because that was ME before I found functional medicine.</p>

<p>Today she texted me this:</p>

<p><em>"Lisa, I went hiking with my daughter yesterday. HIKING. We walked 4 miles and I wasn't exhausted. I've been trying to do this for 3 years. Thank you for giving me my life back."</em></p>

<p>I'm not going to pretend I handled it professionally. I straight up ugly cried in my home office for 20 minutes.</p>

<p>What we did (using what I learned in the program):</p>
<ul>
<li>Ran a comprehensive stool test - found SIBO and candida overgrowth</li>
<li>Identified hidden food sensitivities through elimination protocol</li>
<li>Supported her liver detox pathways</li>
<li>Balanced her blood sugar with the meal timing strategies from Module 4</li>
<li>Worked on stress management using the HPA axis protocol</li>
</ul>

<p>None of this is revolutionary. It's the stuff her doctors SHOULD have checked but didn't.</p>

<p>Sarah always says: "You don't need to be the smartest practitioner. You just need to ask the questions no one else is asking."</p>

<p>This is why we do this work. This one text message made every late night of studying worth it.</p>

<p>Maria gave me permission to share this. She wants other women to know there IS hope. ❤️</p>`,
    viewCount: 6123,
    daysAgo: 5,
  },
  {
    authorName: { first: "Diane", last: "Bartiromo" },
    avatar: ZOMBIE_AVATARS[7],
    title: "At 62 years old, I just had my first $10K month. Age is just a number.",
    content: `<p>I know there are others like me here - "older" women wondering if it's too late to start something new.</p>

<p>After 40 years of nursing, I retired in 2023. Within 3 months I was going stir crazy. My husband was ready to build me an office in the garage just to get me out of the house. 😂</p>

<p>I found this program honestly thinking it would just be something to keep my brain active. Maybe help a few friends with their health.</p>

<p>Fast forward 14 months: <strong>Last month I earned $10,347.</strong></p>

<p>No alarm clock at 5 AM. No 2-hour commutes. No administrators telling me I have 5 minutes per patient.</p>

<p>When I first joined, I told Sarah I was worried about the technology. I barely knew how to use Zoom!</p>

<p>She laughed and said: <em>"Diane, if you can navigate a hospital's electronic medical records system, you can learn anything. Those things are designed by people who hate nurses."</em></p>

<p>She was right. 😂</p>

<p><strong>My secret to success at 62:</strong></p>
<ul>
<li>I work exclusively with women 50+ going through menopause</li>
<li>They trust me because I've BEEN THERE</li>
<li>I understand what it's like to wake up in a pool of sweat and wonder where your brain went</li>
<li>My 40 years of patient care gave me communication skills no course could teach</li>
</ul>

<p>The certification gave me the updated clinical knowledge. The business modules taught me how to package my services. Sarah taught me that my age is my ADVANTAGE, not my limitation.</p>

<p>To my fellow "mature" practitioners: Our experience is our superpower. Don't let anyone tell you you're too old for this.</p>

<p>The best chapter of my career started at 61. What are you waiting for? 💪</p>`,
    viewCount: 7891,
    daysAgo: 2,
  },
  {
    authorName: { first: "Tammy", last: "Burks" },
    avatar: ZOMBIE_AVATARS[10],
    title: "My daughter finally got diagnosed after 2 YEARS - because I learned to read labs",
    content: `<p>This isn't a business win. This is a MOM win. And honestly, it means more to me than any client payment ever could.</p>

<p>My 19-year-old daughter has been passing out every time she's stressed for the past two years. Every doctor told us she was "fine." They suggested anxiety medication. One even implied she was faking it for attention.</p>

<p>As a nurse practitioner, I felt like a failure. I couldn't figure out what was wrong with my own child.</p>

<p>Then I started the program. In Module 3, Sarah teaches about the HPA axis and adrenal dysfunction. Something clicked.</p>

<p>I ran the labs we learned about - DUTCH test, comprehensive metabolic panel with the functional ranges (not just "normal"), cortisol awakening response.</p>

<p>Her cortisol was TANKED. Like, barely registering. Classic adrenal insufficiency pattern that every "normal" lab had missed because they only looked at single-point cortisol.</p>

<p>I messaged Sarah at midnight, panicking. She responded within 2 hours with a protocol outline and said: <em>"Trust what you learned. You know more than those doctors now. You just need to believe it."</em></p>

<p>Three months later, my daughter hasn't passed out ONCE.</p>

<p>She's back at college. She's living her life. She's not "the girl who faints."</p>

<p>I'm crying typing this because I almost gave up on this program in week 2. I thought it was "too much" with my NP job and family.</p>

<p>Thank God I didn't.</p>

<p>If you're here because you're frustrated with the medical system failing you or someone you love - KEEP GOING. The answers are in this program. Sarah will help you find them. 💜</p>`,
    viewCount: 8934,
    daysAgo: 1,
  },
  {
    authorName: { first: "Karyne", last: "Martins" },
    avatar: ZOMBIE_AVATARS[11],
    title: "From Hashimoto's patient to practitioner helping OTHER thyroid warriors - full circle moment",
    content: `<p>13 years ago, I was diagnosed with Hashimoto's thyroiditis. I was a massage therapist, exhausted all the time, watching my hair fall out in clumps.</p>

<p>Doctors said: "Take this pill. You'll be on it forever. That's just how it is."</p>

<p>I refused to accept that. I spent a DECADE learning about functional medicine informally - podcasts, books, YouTube videos. I managed to significantly improve my own labs through diet and lifestyle.</p>

<p>But I always felt like an imposter. Like I couldn't REALLY help people because I didn't have the credentials.</p>

<p>This program changed everything.</p>

<p>Now I'm certified. I have the knowledge to back up my experience. And I just signed my <strong>5th thyroid client this month</strong>.</p>

<p>What Sarah taught me that I couldn't learn from podcasts:</p>
<ul>
<li>How to structure a proper intake that catches things doctors miss</li>
<li>The specific lab markers that matter for Hashimoto's (not just TSH!)</li>
<li>How to create protocols that are realistic for exhausted thyroid patients</li>
<li>How to run a business while managing my OWN energy levels</li>
</ul>

<p>Last week, a client told me: <em>"You're the first person who's ever actually understood what this feels like."</em></p>

<p>That's because I DO understand. I've lived it. And now I have the tools to help others live BETTER with it.</p>

<p>To anyone here with their own health struggles wondering if this is "for them" - your mess becomes your message. Your struggle becomes your superpower.</p>

<p>Thank you Sarah for seeing the practitioner in me before I saw it in myself. 💛</p>`,
    viewCount: 5678,
    daysAgo: 9,
  },
  {
    authorName: { first: "Nancy", last: "Brooke" },
    avatar: ZOMBIE_AVATARS[12],
    title: "I spent $15K on other certifications that got me NOWHERE. This $97 program changed my life.",
    content: `<p>I need to be brutally honest here because I wish someone had told me this 5 years ago.</p>

<p>I spent FIVE YEARS getting certified as a health coach. Two different programs. Over $15,000 total. And I never signed a single paying client.</p>

<p>I didn't feel qualified. I didn't know how to actually help people. I definitely didn't know how to run a business.</p>

<p>I walked away from health coaching completely. Told myself it wasn't for me.</p>

<p>Then a friend casually sent me a link to this program. She had no idea about my history - it was just a random share.</p>

<p>I almost didn't sign up. $97 seemed "too cheap to be real." (Ironic, given what I'd already spent.)</p>

<p>But something in me said: one more try.</p>

<p><strong>The difference with this program:</strong></p>
<ul>
<li>It's CLINICAL. Not just "wellness" fluff. I learned actual protocols.</li>
<li>The lab interpretation module alone is worth 10x what I paid</li>
<li>Sarah doesn't just teach - she COACHES. She's in the community daily.</li>
<li>The business training is built IN, not an expensive add-on</li>
</ul>

<p>Six months after starting, I have 6 paying clients generating $3,200/month.</p>

<p>When I messaged Sarah about my past failures, she said something I'll never forget:</p>

<p><em>"Nancy, you weren't a failure. You were just in the wrong programs. Your calling to help people never went away - that's why you're here. Let's channel it properly this time."</em></p>

<p>I cried for an hour.</p>

<p>If you're here after other programs didn't work out - you're in the right place now. Give it one more shot. You won't regret it. 🙏</p>`,
    viewCount: 6234,
    daysAgo: 4,
  },
  {
    authorName: { first: "Brandy", last: "Smieja" },
    avatar: ZOMBIE_AVATARS[13],
    title: "Single mom of 3, full-time job, and I STILL made $2,400 this month. Here's how.",
    content: `<p>I know some of you are thinking: "I don't have TIME for this."</p>

<p>Trust me. I get it.</p>

<p>I'm a single mom with 3 kids (ages 7, 11, and 14). I work full-time as a medical assistant. I have approximately ZERO free time.</p>

<p>But I knew my calling was to help people heal. I've always known it. Life just kept getting in the way.</p>

<p>When I found this program, I was honest with Sarah: "I can maybe do 30 minutes a day. Is that even worth it?"</p>

<p>Her response: <em>"Brandy, 30 focused minutes beats 3 scattered hours. Let me show you how to build this around your REAL life, not some fantasy schedule."</em></p>

<p><strong>How I did it with almost no time:</strong></p>
<ul>
<li>Watched modules during my lunch break (ate at my desk)</li>
<li>Did the quizzes while kids did homework</li>
<li>Practiced discovery calls in the car during school pickup line</li>
<li>Posted on social media at 10pm when kids were asleep</li>
<li>Took client calls during my lunch hour (boss thinks I'm on "personal calls")</li>
</ul>

<p>It took me 4 months to finish the certification instead of 6 weeks. So what? I finished.</p>

<p>This month: <strong>4 clients, $2,400 in revenue.</strong></p>

<p>That's groceries for 2 months. That's Christmas presents paid for. That's my daughter's volleyball fees covered.</p>

<p>The program met me where I was. Sarah never made me feel bad about my pace. She just kept encouraging me to keep going.</p>

<p>To every exhausted mom, every overwhelmed caregiver, every person working two jobs - you CAN do this. Your "not enough time" is enough. Just start. 💪</p>`,
    viewCount: 7123,
    daysAgo: 6,
  },
  {
    authorName: { first: "Donna", last: "McMenamin" },
    avatar: ZOMBIE_AVATARS[14],
    title: "After 10 years of Lyme disease, I'm finally helping others avoid what I went through",
    content: `<p>This is hard to write. But I think someone needs to hear it.</p>

<p>10 years ago, I got bitten by a tick. What followed was a decade of hell that I wouldn't wish on my worst enemy.</p>

<p>Brain fog so bad I forgot my own address. Fatigue where I slept 16 hours and woke up exhausted. Joint pain that made me feel 80 at 35.</p>

<p>I saw 23 doctors. TWENTY-THREE. Most told me I was depressed. Some suggested I was a hypochondriac. One actually laughed when I mentioned Lyme disease.</p>

<p>I had to become my own detective. I learned to read my own labs. I found functional medicine practitioners who finally helped me. I'm now in remission.</p>

<p>But I'm angry. And that anger became my purpose.</p>

<p>I joined this program because I wanted to help others skip the 10-year diagnostic nightmare I went through.</p>

<p>When I told Sarah my story during orientation, she said:</p>

<p><em>"Donna, your suffering wasn't for nothing. Every tear, every dismissive doctor, every sleepless night - it was training. You understand chronic illness patients in a way no medical textbook can teach. That's your gift."</em></p>

<p>Now I specialize in helping people with chronic mysterious illnesses. The ones doctors have given up on.</p>

<p>This month: <strong>3 new clients, all Lyme or chronic fatigue. $3,600.</strong></p>

<p>More importantly: I'm helping them get answers in MONTHS instead of YEARS.</p>

<p>The program gave me the clinical framework. The certification gave me credibility. Sarah gave me permission to turn my pain into purpose.</p>

<p>If you're here because the medical system failed you - you're exactly where you need to be. Your story matters. Your experience matters. Let's use it to help others. 💚</p>`,
    viewCount: 8456,
    daysAgo: 8,
  },
];

// "New Graduates" posts - Celebrating certification achievements
const GRADUATES_POSTS = [
  {
    authorName: { first: "Julie", last: "Frady" },
    avatar: ZOMBIE_AVATARS[4],
    title: "After 16 years as an RN... I'M OFFICIALLY CERTIFIED! 🎓",
    content: `<p>It's official! I just received my Certified Functional Medicine Practitioner credential!</p>

<p>16 years of being frustrated with the "sick care" system. 16 years of watching patients come back over and over with the same problems because we were only treating symptoms.</p>

<p>No more.</p>

<p>This journey started because I was sick myself. Autoimmune issues that "conventional" medicine couldn't figure out. I had to become my own health advocate, and that led me here.</p>

<p>When I messaged Sarah after passing the exam, she sent me a voice note that made me cry:</p>

<p><em>"Julie, you're not leaving nursing. You're EVOLVING it. You're taking everything you learned in 16 years and adding the missing piece - root cause medicine. Your future patients are so lucky."</em></p>

<p><strong>What I learned in this program that nursing school never taught me:</strong></p>
<ul>
<li>How to actually READ labs (not just look at whether they're in the "normal" range)</li>
<li>The gut-brain-hormone connection that explains SO MUCH</li>
<li>How to help people heal, not just manage their conditions</li>
<li>That I'm not crazy for believing there's a better way</li>
</ul>

<p>The exam was challenging but fair. Everything I needed was in the modules. Sarah's breakdown of lab interpretation in Module 4 was literally the key to passing.</p>

<p>To my fellow nurses who feel trapped in a system that doesn't align with your values: there IS another path. It's hard, but it's worth it.</p>

<p>Next step: Building my practice helping other healthcare workers heal from burnout and autoimmune conditions.</p>

<p>Thank you Sarah. Thank you AccrediPro. Thank you to this community. I couldn't have done it without you. 🚀</p>`,
    viewCount: 4234,
    daysAgo: 8,
  },
  {
    authorName: { first: "Kira", last: "Reoch" },
    avatar: ZOMBIE_AVATARS[9],
    title: "From ICU nurse to certified practitioner - Mom, this one's for you 💔",
    content: `<p>I passed my certification exam this morning.</p>

<p>First person I wanted to call was my mom. But she passed away last year.</p>

<p>20 years I spent in ICU and flight nursing. Saw more death than anyone should. But nothing prepared me for losing her - heart and kidney failure that could have been prevented.</p>

<p>She trusted her doctors completely. Did everything they said. And they failed her.</p>

<p>After she passed, I couldn't go back to the hospital. Something broke in me. My sister suggested I look into functional medicine because she'd been dealing with autoimmune issues too.</p>

<p>I found AccrediPro. I found Sarah. I found my PURPOSE.</p>

<p>When I told Sarah about my mom during our first call, she didn't give me platitudes. She said:</p>

<p><em>"Kira, grief is fuel when channeled right. Your mom's death can save other moms. Other daughters. That's the legacy you can build."</em></p>

<p>This program didn't just teach me functional medicine - it helped me heal.</p>

<p>Understanding that my mom's death wasn't anyone's fault, but the SYSTEM that failed her... that gave me direction instead of just anger.</p>

<p><strong>The certification process:</strong></p>
<ul>
<li>Took me 8 weeks to complete (I did it intensively)</li>
<li>The modules are dense but digestible</li>
<li>Sarah's case studies made everything click</li>
<li>The community answered my questions within hours</li>
<li>The exam was comprehensive but absolutely passable if you do the work</li>
</ul>

<p>Mom, I promise: I'm going to help others avoid what happened to you. I'm going to teach people to be their own health advocates. Your death will not be in vain.</p>

<p>Thank you to everyone in this community who supported me through the hard days. You know who you are. ❤️</p>`,
    viewCount: 8456,
    daysAgo: 14,
  },
  {
    authorName: { first: "Suzette", last: "Burke" },
    avatar: ZOMBIE_AVATARS[2],
    title: "Certified at last! From cancer patient to health practitioner - full circle 🎗️",
    content: `<p>Two years ago I was diagnosed with breast cancer. I was a Med-Surg nurse, and suddenly I was the patient.</p>

<p>The experience changed everything.</p>

<p>Lying in that hospital bed, hooked up to chemo, I had a lot of time to think. I realized that if I had known then what I know now about nutrition, stress, and lifestyle factors... maybe things would have been different.</p>

<p>Today I received my certification, and I couldn't be more proud.</p>

<p>When I enrolled, I was honest with Sarah about my diagnosis. She said something that stuck with me:</p>

<p><em>"Suzette, some of the best healers are wounded healers. You're not becoming a practitioner DESPITE your cancer - you're becoming one BECAUSE of it. Your empathy will be your superpower."</em></p>

<p>She was right.</p>

<p>This isn't just about a piece of paper for me. It's about a promise I made to myself in the chemo chair: <strong>If I survive this, I'm going to help others prevent it.</strong></p>

<p><strong>What I love about this program:</strong></p>
<ul>
<li>We look at the WHOLE person, not just symptoms</li>
<li>The cancer prevention and terrain module was incredible</li>
<li>We believe the body can heal when given the right support</li>
<li>We don't just treat diseases - we optimize health</li>
<li>Sarah's teaching style made complex concepts understandable</li>
</ul>

<p>I'm currently in remission, healthier than I've ever been, and ready to start helping other cancer survivors reclaim their health.</p>

<p>To anyone going through something similar: You're stronger than you know. Use your pain as your purpose.</p>

<p>Thank you Sarah and AccrediPro for giving me a second chapter. 💗</p>`,
    viewCount: 5678,
    daysAgo: 6,
  },
  {
    authorName: { first: "Joanne", last: "Bertrand" },
    avatar: ZOMBIE_AVATARS[8],
    title: "Passed with flying colors at 67! This retired nurse just started Chapter 2 🌟",
    content: `<p>After 35 years as an RN - cardiology, oncology, hospice - I thought retirement would be relaxing.</p>

<p>I was bored out of my mind within 6 weeks.</p>

<p>My daughter sent me a link to this program, probably hoping it would stop me from rearranging her kitchen every time I visited. 😂</p>

<p>Well, honey, it worked. <strong>I just passed my certification exam!</strong></p>

<p>I'll be honest - I was TERRIFIED of the technology. At 67, I barely knew how to use Zoom. I thought everyone would be these young Instagram influencer types.</p>

<p>When I confessed this to Sarah, she laughed and said:</p>

<p><em>"Joanne, you survived 35 years of hospital politics, difficult doctors, and family members in crisis. You can handle a Zoom call. And guess what? Your 35 years of experience is worth MORE than any TikTok following. Don't forget that."</em></p>

<p><strong>What surprised me most about the program:</strong></p>
<ul>
<li>How much has changed in medicine since nursing school (SO much!)</li>
<li>How much I DIDN'T know about nutrition and gut health</li>
<li>That you CAN teach an old dog new tricks</li>
<li>The online community is actually amazing (I was skeptical)</li>
<li>The younger students actually VALUE our wisdom and experience</li>
</ul>

<p>The exam was challenging but fair. I studied like it was nursing boards all over again. Used the practice questions, re-watched the modules, took notes like a college student.</p>

<p>At 67, I'm starting a practice focusing on helping seniors optimize their health without just adding more pills. Because I've seen too many of my peers deteriorate when it didn't have to happen that way.</p>

<p>To my fellow "mature" students: Do it. Your decades of experience are an ASSET.</p>

<p>Here's to Chapter 2! 🥂</p>

<p>Thank you Sarah for never making me feel too old for this dream.</p>`,
    viewCount: 4890,
    daysAgo: 4,
  },
  {
    authorName: { first: "Kelly", last: "McMahon" },
    avatar: ZOMBIE_AVATARS[1],
    title: "25 years as an ARNP, now certified in FM. Best decision of my career. 🎓",
    content: `<p>I'm going to be honest: I was completely burned out.</p>

<p>25 years as an Advanced Practice Registered Nurse, watching healthcare become more and more about insurance companies and less about actual patient care. I was spending more time on paperwork than with patients.</p>

<p>Worse, I wasn't helping anyone GET BETTER. I was just... managing their decline. Prescription after prescription.</p>

<p>When I found functional medicine, I was skeptical. Sounded too "woo-woo" for my evidence-based brain. But I kept hearing success stories from colleagues who'd made the switch.</p>

<p>I signed up thinking: "If it's garbage, I'm only out $97."</p>

<p>Plot twist: It wasn't garbage. It was exactly what I'd been missing for 25 years.</p>

<p>Sarah's approach blew me away. On our first call, she said:</p>

<p><em>"Kelly, you're not here to unlearn everything. You're here to ADD to your foundation. Your clinical training is invaluable - we're just filling in what medical school left out."</em></p>

<p><strong>Why this program worked for my skeptical brain:</strong></p>
<ul>
<li>It's evidence-based, not "woo woo"</li>
<li>Every protocol is backed by research Sarah explains</li>
<li>It builds ON my clinical knowledge, doesn't contradict it</li>
<li>The lab interpretation goes DEEPER than my NP training</li>
<li>It's practical - I started using techniques with patients immediately</li>
</ul>

<p>Now that I'm certified, I understand why my patients weren't getting better:</p>

<p>We were treating SYMPTOMS, not SYSTEMS.</p>

<p>I finally feel like a healer again. And the best part? I'm now charging what my 25 years of experience are actually worth. No more insurance dictating my fees.</p>

<p>To my fellow nurse practitioners considering this path: Your clinical background is INVALUABLE. Don't let it go to waste in a broken system. There's a better way.</p>

<p>Thank you Sarah. Thank you AccrediPro. Here's to being paid for our knowledge, not just our time! 🙌</p>`,
    viewCount: 6234,
    daysAgo: 10,
  },
  {
    authorName: { first: "Allison", last: "Johnson" },
    avatar: ZOMBIE_AVATARS[15],
    title: "CNM + IFM certification + NOW AccrediPro certified = FINALLY feeling prepared! 🎓",
    content: `<p>Okay, real talk: I'm a certification junkie.</p>

<p>I'm a Certified Nurse Midwife. I'm also working on my Institute of Functional Medicine certification (which costs $15K+ by the way).</p>

<p>So why did I also do this program?</p>

<p>Because IFM is GREAT for theory but terrible for practical application. I was drowning in information but had NO IDEA how to actually help my patients or build a practice.</p>

<p>Someone in my IFM cohort mentioned AccrediPro. I was skeptical - how could a $97 program compare?</p>

<p>It doesn't compare. IT'S BETTER. At least for practical application.</p>

<p>What Sarah and this program gave me that IFM didn't:</p>
<ul>
<li>Actual PROTOCOLS I can use tomorrow</li>
<li>Lab interpretation that's practical, not just theoretical</li>
<li>Business training (IFM has ZERO of this)</li>
<li>A community that actually responds when you ask questions</li>
<li>A coach who cares about YOUR success, not just your tuition payment</li>
</ul>

<p>I told Sarah my frustration with IFM, and she said:</p>

<p><em>"Allison, those programs give you the PhD-level knowledge. We give you the street-level skills. You need both. But knowing doesn't matter if you can't DO."</em></p>

<p>She was right.</p>

<p>Passed my certification exam yesterday. Now I feel like I FINALLY have all the pieces:</p>
<ul>
<li>CNM = Clinical credibility</li>
<li>IFM = Deep theoretical knowledge</li>
<li>AccrediPro = Practical skills + business know-how</li>
</ul>

<p>To anyone else who's "over-certified but under-confident" - this program will fill in your gaps.</p>

<p>Thank you Sarah for helping this perfectionist finally feel READY. 💛</p>`,
    viewCount: 3890,
    daysAgo: 3,
  },
  {
    authorName: { first: "Heather", last: "King" },
    avatar: ZOMBIE_AVATARS[16],
    title: "Certified from AUSTRALIA! 🇦🇺 Proof this works internationally",
    content: `<p>For all my international folks wondering if this program works outside the US - IT DOES!</p>

<p>I'm in Brisbane, Australia. Burnt out RN. Hadn't heard of "functional medicine" until 2 years ago because Australia is about 10 years behind on everything health-related. 😅</p>

<p>When I found AccrediPro, I emailed Sarah with about 47 questions:</p>
<ul>
<li>Will this certification be recognized in Australia?</li>
<li>Can I use these protocols here?</li>
<li>What about the labs - do we even have these in Oz?</li>
<li>Time zones - will I miss all the live calls?</li>
</ul>

<p>She responded to every. single. question.</p>

<p>Her advice: <em>"Heather, health coaching isn't regulated the same way in Australia as the US. That's actually an ADVANTAGE. You can practice more freely. And the knowledge is universal - bodies work the same everywhere."</em></p>

<p><strong>What worked for me as an international student:</strong></p>
<ul>
<li>All modules are pre-recorded - watch anytime (3am my time = normal hours in the US)</li>
<li>Sarah helped me find Australian lab equivalents</li>
<li>The business training adapts to any market</li>
<li>I connected with 3 other Aussies in the community!</li>
<li>My certification is recognized here as a health coaching credential</li>
</ul>

<p>Passed my exam today! (Took it at 4am to align with US testing windows - dedication, baby! 😂)</p>

<p>Now I'm the ONLY functional medicine health coach in my entire suburb. Zero competition because no one here knows this exists yet.</p>

<p>Sarah always says: "Blue ocean, not red ocean." Australia is definitely blue ocean for this.</p>

<p>To my fellow internationals - don't let geography stop you. This program transcends borders. Thank you Sarah! 🙏</p>`,
    viewCount: 4567,
    daysAgo: 7,
  },
  {
    authorName: { first: "Priyanka", last: "Thakur" },
    avatar: ZOMBIE_AVATARS[17],
    title: "Retired teacher at 62, now CERTIFIED in functional medicine! New career unlocked 🎓",
    content: `<p>I spent 38 years as a high school biology teacher. I LOVED explaining how the body works. But I always felt like something was missing.</p>

<p>When I retired last year, I was lost. Teaching was my identity. Who was I without a classroom?</p>

<p>My daughter suggested I look into health coaching. "Mom, you're always explaining nutrition stuff to your friends anyway. Why not get paid for it?"</p>

<p>I found AccrediPro and immediately felt imposter syndrome.</p>

<p>I messaged Sarah: "I'm not a nurse or doctor. I'm just a teacher. Can I really do this?"</p>

<p>Her response changed my life:</p>

<p><em>"Priyanka, you have 38 YEARS of experience explaining complex concepts in simple terms. That's the HARDEST part of being a practitioner. You're not 'just' a teacher - you're already trained in the most important skill we need."</em></p>

<p>She was right.</p>

<p><strong>Why my teaching background was an ADVANTAGE:</strong></p>
<ul>
<li>I already understood biology deeply</li>
<li>I know how to break down complex topics</li>
<li>I'm patient with people who don't understand</li>
<li>I can create "lesson plans" for my clients</li>
<li>I'm used to answering the same question 50 different ways</li>
</ul>

<p>The program filled in what I didn't know:</p>
<ul>
<li>Clinical lab interpretation</li>
<li>Specific protocols for health conditions</li>
<li>How to structure client consultations</li>
<li>Business basics (teachers know NOTHING about this 😅)</li>
</ul>

<p>Passed my certification exam this week at 62 years old!</p>

<p>Starting a practice helping other retirees understand their health. Because we deserve more than "you're just getting old."</p>

<p>To any teachers or non-medical people reading this: Your background isn't a limitation. It's your unique superpower. Sarah will help you see that. 💪</p>`,
    viewCount: 5123,
    daysAgo: 5,
  },
  {
    authorName: { first: "Steven", last: "Simons" },
    avatar: ZOMBIE_AVATARS[18],
    title: "From bodybuilding champion to FM certified at 65 - never stop evolving 💪🎓",
    content: `<p>Red flags were popping up everywhere when I thought about retiring at 65. All of them said: DON'T STOP NOW.</p>

<p>Quick backstory: In 1990, I was a certified personal trainer and won the Olympia Natural Classic bodybuilding competition. Owned a gym for 5 years. Then life happened - met my wife, had 4 kids, started a construction business.</p>

<p>For 35 years, I put my passion for fitness and health on the back burner.</p>

<p>This year, I decided: no more.</p>

<p>What I believed about fitness 40 years ago wasn't WRONG - it was just incomplete. Functional medicine fills in those gaps.</p>

<p>When I joined and told Sarah my history, she said:</p>

<p><em>"Steven, you've got something most practitioners don't - you've LIVED the fitness journey for 40+ years. You've seen what works and what doesn't firsthand. Add the functional medicine knowledge to that foundation, and you'll be unstoppable."</em></p>

<p><strong>What the program added to my fitness background:</strong></p>
<ul>
<li>The hormonal component I always knew existed but couldn't explain</li>
<li>Why some clients plateau no matter what they do (hint: it's gut health)</li>
<li>The inflammation piece that affects recovery</li>
<li>How to read labs to personalize recommendations</li>
<li>The business structure I never had with my gym</li>
</ul>

<p>Passed my certification yesterday. At 65.</p>

<p>My plan: Help men 50+ optimize their health without killing themselves in the gym. Because I know what it's like to have that aging body but still want to feel strong.</p>

<p>My reason: My 4 children and 10 grandchildren. I want to be here for them. And I want to help others do the same.</p>

<p>You teach me, I teach them, and we all become something more.</p>

<p>Thank you Sarah. Let's go! 🙌</p>`,
    viewCount: 4890,
    daysAgo: 2,
  },
  {
    authorName: { first: "Jamie", last: "Fernando" },
    avatar: ZOMBIE_AVATARS[19],
    title: "My answered prayer. Certified after 20 years of searching for my PURPOSE. 🙏🎓",
    content: `<p>Hi there, my name is Jamie and I need to share something deeply personal.</p>

<p>20 years ago, at 18 years old, I was diagnosed with psoriasis. I followed every doctor's recommendation. Took every medication. "Cleared" the psoriasis... but I knew I wasn't HEALED.</p>

<p>That experience sparked something in me. A calling I couldn't explain. A deep, sacred sense that I was meant to HEAL.</p>

<p>Fast forward 20 years: I'm a cardiac nurse, mother of 2, and still feeling that unexplained calling.</p>

<p>I have prayed for signs. For years.</p>

<p>I believe this program was my answered prayer.</p>

<p>When I told Sarah my story during orientation, I was crying. I said: "I've felt this calling for 20 years but I don't know what to DO with it."</p>

<p>She said:</p>

<p><em>"Jamie, that calling never goes away because it's your PURPOSE. It's been waiting patiently for you to be ready. You're ready now. Let's channel it."</em></p>

<p><strong>What the program gave me after 20 years of searching:</strong></p>
<ul>
<li>A FRAMEWORK for the intuitive knowledge I already had</li>
<li>Clinical skills to back up my spiritual calling</li>
<li>Confidence that what I feel is REAL and VALID</li>
<li>A path that combines heart and science</li>
<li>A community of people who understand</li>
</ul>

<p>Passed my certification exam this morning. Cried through the entire results screen.</p>

<p>I'm finally who I was always meant to be: a healer who combines clinical knowledge with deep compassion.</p>

<p>To anyone else feeling that unexplained calling: Trust it. It's real. This program will help you give it form.</p>

<p>Thank you Sarah for seeing in me what I couldn't see in myself. Thank you AccrediPro for being the answer to my prayers. 🙏💕</p>`,
    viewCount: 7234,
    daysAgo: 1,
  },
];

async function main() {
  console.log('🚀 Starting wins and graduates posts seed...\n');

  // First, delete existing posts from this seed to avoid duplicates
  console.log('🗑️ Cleaning up existing seeded posts...');
  const existingAuthors = [...WINS_POSTS, ...GRADUATES_POSTS].map(p =>
    `${p.authorName.first} ${p.authorName.last}`
  );

  // Delete posts by these authors
  for (const authorName of existingAuthors) {
    const [first, last] = authorName.split(' ');
    const author = await prisma.user.findFirst({
      where: {
        firstName: first,
        lastName: last,
        isFakeProfile: true,
      }
    });

    if (author) {
      await prisma.communityPost.deleteMany({
        where: { authorId: author.id }
      });
    }
  }
  console.log('  ✅ Cleaned up existing posts');

  // Get Coach Sarah for potential interactions
  let coachSarah = await prisma.user.findFirst({
    where: { email: 'sarah@accredipro-certificate.com' }
  });

  if (!coachSarah) {
    coachSarah = await prisma.user.findFirst({
      where: { role: 'MENTOR', firstName: 'Sarah' }
    });
  }

  if (!coachSarah) {
    console.error('❌ Coach Sarah not found! Run ensure-sarah-coach.ts first.');
    process.exit(1);
  }
  console.log('✅ Found Coach Sarah:', coachSarah.id);

  // Create zombie profiles for post authors
  const userMap = new Map<string, string>();

  console.log('\n👥 Creating zombie profiles for post authors...');
  const allPosts = [...WINS_POSTS, ...GRADUATES_POSTS];

  for (const post of allPosts) {
    const key = `${post.authorName.first}-${post.authorName.last}`;
    if (userMap.has(key)) continue;

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        firstName: post.authorName.first,
        lastName: post.authorName.last,
        isFakeProfile: true,
      }
    });

    if (existingUser) {
      // Update avatar if needed
      await prisma.user.update({
        where: { id: existingUser.id },
        data: { avatar: post.avatar }
      });
      userMap.set(key, existingUser.id);
      console.log(`  ↩️ Using existing user: ${post.authorName.first} ${post.authorName.last}`);
      continue;
    }

    // Create new fake user
    const newUser = await prisma.user.create({
      data: {
        firstName: post.authorName.first,
        lastName: post.authorName.last,
        avatar: post.avatar,
        role: 'STUDENT',
        isFakeProfile: true,
        isActive: true,
        hasCertificateBadge: true, // They're all certified!
      }
    });
    userMap.set(key, newUser.id);
    console.log(`  ✅ Created: ${post.authorName.first} ${post.authorName.last}`);
  }

  // Create "Share Your Wins" posts
  console.log('\n🏆 Creating "Share Your Wins" posts...');
  for (const post of WINS_POSTS) {
    const key = `${post.authorName.first}-${post.authorName.last}`;
    const authorId = userMap.get(key)!;

    const createdAt = new Date();
    createdAt.setDate(createdAt.getDate() - post.daysAgo);

    await prisma.communityPost.create({
      data: {
        title: post.title,
        content: post.content,
        categoryId: 'wins',
        isPinned: false,
        viewCount: post.viewCount,
        authorId: authorId,
        createdAt: createdAt,
      }
    });
    console.log(`  ✅ Created: "${post.title.substring(0, 50)}..."`);
  }

  // Create "New Graduates" posts
  console.log('\n🎓 Creating "New Graduates" posts...');
  for (const post of GRADUATES_POSTS) {
    const key = `${post.authorName.first}-${post.authorName.last}`;
    const authorId = userMap.get(key)!;

    const createdAt = new Date();
    createdAt.setDate(createdAt.getDate() - post.daysAgo);

    await prisma.communityPost.create({
      data: {
        title: post.title,
        content: post.content,
        categoryId: 'graduates',
        isPinned: false,
        viewCount: post.viewCount,
        authorId: authorId,
        createdAt: createdAt,
      }
    });
    console.log(`  ✅ Created: "${post.title.substring(0, 50)}..."`);
  }

  // Add supportive comments from Coach Sarah
  console.log('\n💬 Adding Coach Sarah comments...');

  const winsPosts = await prisma.communityPost.findMany({
    where: { categoryId: 'wins' },
    orderBy: { createdAt: 'desc' },
    take: 10,
  });

  const sarahCommentsWins = [
    "I remember your first message to me - look how far you've come! So incredibly proud of you. Your dedication is paying off in ways you haven't even seen yet. Keep going! 🙌",
    "This is EXACTLY why I do this work. Your transformation story will inspire so many others. Thank you for being so vulnerable and sharing. You're changing lives! 💕",
    "Reading this brought tears to my eyes. You showed up every single day, even when it was hard. THAT'S what success looks like. Congratulations - you earned every bit of this!",
    "I knew from our first call you had something special. Your journey from skepticism to success is going to help so many others take that first step. So proud of you!",
    "This is what happens when you trust the process and trust yourself. You did the work - I just pointed you in the right direction. The success is ALL yours! 🚀",
    "Your story of turning pain into purpose is incredibly powerful. Thank you for being so open - someone reading this right now needed to hear exactly this. You're a healer!",
    "Remember when you almost quit in month 2? Look at you now! This is why I always say: the people who succeed aren't the ones with the most talent, they're the ones who don't give up. So proud! 💪",
    "Your transformation is proof that it's NEVER too late. Age is just a number - experience is a SUPERPOWER. Thank you for showing our community what's possible! 🌟",
    "From our very first conversation, I saw someone ready for change. You just needed permission to believe in yourself. Now look at you - giving that same permission to others! ❤️",
    "This community is better because you're in it. Your willingness to share both the struggles AND the victories helps everyone. Congratulations on everything you've accomplished!"
  ];

  for (let i = 0; i < winsPosts.length; i++) {
    await prisma.postComment.create({
      data: {
        content: sarahCommentsWins[i] || sarahCommentsWins[0],
        postId: winsPosts[i].id,
        authorId: coachSarah.id,
        createdAt: new Date(new Date(winsPosts[i].createdAt).getTime() + 3600000), // 1 hour after post
      }
    });
  }
  console.log(`  ✅ Added ${winsPosts.length} Coach Sarah comments to wins`);

  const gradPosts = await prisma.communityPost.findMany({
    where: { categoryId: 'graduates' },
    orderBy: { createdAt: 'desc' },
    take: 10,
  });

  const sarahCommentsGrads = [
    "CONGRATULATIONS! 🎓 You worked so hard for this and it shows. Your future clients are incredibly lucky to have you. Welcome to the next chapter of your career!",
    "I'm crying reading this. Your 'why' is so powerful and your certification is just the beginning. You're going to do amazing things. So honored to be part of your journey! 💕",
    "From cancer warrior to certified healer - your story is going to give hope to so many. Congratulations on turning your challenge into your calling! 🎗️",
    "67 years young and just getting started! You're proof that it's never too late to follow your dreams. So proud of you! Here's to Chapter 2! 🥂",
    "Your 25 years of clinical experience + this certification = unstoppable combination. Can't wait to see you transform healthcare one client at a time!",
    "Three certifications and NOW you feel ready - that says so much about your commitment to excellence. Your future clients are going to get the BEST. Congratulations! 💛",
    "International success story! You've proven that geography is no barrier to following your purpose. Congratulations from across the ocean! 🌏",
    "From teacher to healer - your ability to explain complex things simply is a GIFT. Your clients are going to love learning from you. Congratulations!",
    "40 years of fitness wisdom + functional medicine knowledge = the complete package. Your clients are going to get results others only dream of. Congratulations, Steven! 💪",
    "Your 20-year calling has found its home. Welcome to your purpose, certified healer. The world needs what you have to offer. So incredibly proud! 🙏"
  ];

  for (let i = 0; i < gradPosts.length; i++) {
    await prisma.postComment.create({
      data: {
        content: sarahCommentsGrads[i] || sarahCommentsGrads[0],
        postId: gradPosts[i].id,
        authorId: coachSarah.id,
        createdAt: new Date(new Date(gradPosts[i].createdAt).getTime() + 3600000),
      }
    });
  }
  console.log(`  ✅ Added ${gradPosts.length} Coach Sarah comments to graduates`);

  // Output summary
  console.log('\n' + '='.repeat(50));
  console.log('✅ Seed Complete!');
  console.log('='.repeat(50));
  console.log(`🏆 "Share Your Wins" posts created: ${WINS_POSTS.length}`);
  console.log(`🎓 "New Graduates" posts created: ${GRADUATES_POSTS.length}`);
  console.log(`👥 Zombie profiles created/used: ${userMap.size}`);
  console.log(`💬 Coach Sarah comments added: ${winsPosts.length + gradPosts.length}`);
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
