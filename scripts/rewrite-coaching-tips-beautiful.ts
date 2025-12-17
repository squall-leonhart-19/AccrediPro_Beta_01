import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// Beautiful HTML coaching tips for 40+ US women
const COACHING_TIPS: Record<string, string> = {
  "Coaching Tip #1: Your Health Struggle Was Never Wasted": `
<p>Hi there! 💕</p>

<p>Can I tell you about <strong>Jennifer</strong>?</p>

<p>Three years ago, Jennifer was a 47-year-old marketing executive who couldn't remember the last time she felt "normal." <mark style="background: #fef08a; padding: 2px 4px; border-radius: 3px;">Brain fog so thick she'd forget her own phone number.</mark> Exhaustion so deep that 10 hours of sleep felt like 2.</p>

<p>Doctors told her it was <em>"just stress"</em> and handed her antidepressants. 😔</p>

<p><strong>Sound familiar?</strong></p>

<p>Jennifer didn't accept that answer. She went down the rabbit hole — functional medicine books, podcasts, courses. She started connecting dots her doctors never bothered to look for:</p>

<ul style="margin: 16px 0; padding-left: 24px;">
  <li>🔍 Gut issues linked to her brain fog</li>
  <li>🔍 Blood sugar crashes causing afternoon crashes</li>
  <li>🔍 Hormonal chaos from years of chronic stress</li>
</ul>

<p><mark style="background: #fef08a; padding: 2px 4px; border-radius: 3px;">She healed herself.</mark></p>

<p>And then something unexpected happened. Her coworkers started asking: <em>"What are you DOING? You look amazing!"</em></p>

<p>Her sister called: <em>"Can you help me figure out my thyroid issues?"</em></p>

<p>Her neighbor knocked on her door: <em>"Jennifer, I'm desperate. My doctor says nothing's wrong but I KNOW something is."</em></p>

<p>That's when Jennifer realized: <strong>Her struggle was her training ground.</strong> ✨</p>

<p>Every sleepless night researching. Every doctor's appointment that left her frustrated. Every symptom she tracked, every food she eliminated — <mark style="background: #fef08a; padding: 2px 4px; border-radius: 3px;">it wasn't just for HER healing. It was preparing her to help OTHERS heal.</mark></p>

<p>Today, Jennifer runs a thriving functional medicine practice. She charges <strong>$2,500</strong> for her 12-week programs. She has a waiting list. 🎉</p>

<p><strong>Here's what I need you to understand:</strong></p>

<p>Your journey — the struggle, the confusion, the moments you cried in frustration — <mark style="background: #bbf7d0; padding: 2px 4px; border-radius: 3px;">it wasn't wasted. It was your education.</mark></p>

<p>The best functional medicine practitioners aren't the ones with the most degrees. <strong>They're the ones who've LIVED it.</strong></p>

<p>💚 Your mess is your message.<br/>
💚 Your pain is your purpose.<br/>
💚 Your struggle is your superpower.</p>

<p>And your future clients? They're out there RIGHT NOW, feeling exactly how you felt. Searching for someone who GETS it.</p>

<p><strong>That someone is you.</strong> 💪</p>

<p style="margin-top: 24px; padding: 16px; background: #fef3c7; border-radius: 8px;">
  💬 <strong>YOUR TURN:</strong> Drop your health journey story below in 2-3 sentences. What brought YOU to functional medicine? I read every single one! 👇
</p>

<p>Sarah M. 💕</p>
`,

  "Coaching Tip #2: Imposter Syndrome Is Proof You Care": `
<p>Hi there! 💕</p>

<p>Let me share something that might surprise you.</p>

<p>Last month, I was on a call with <strong>Maria</strong> — a former ICU nurse with <mark style="background: #fef08a; padding: 2px 4px; border-radius: 3px;">22 years of medical experience</mark>, two certifications, and a genuine passion for helping people.</p>

<p>Know what she said?</p>

<p><em>"Sarah, who am I to call myself a health coach? There are people with PhDs doing this. I'm just a nurse."</em> 😔</p>

<p><strong>JUST a nurse?!</strong></p>

<p>This woman has literally saved lives. She's held hands of dying patients. She's seen what the medical system gets wrong — and right.</p>

<p>And she feels like an imposter.</p>

<p>Here's the truth I shared with her (and I want you to hear it too):</p>

<p style="padding: 16px; background: #f0fdf4; border-left: 4px solid #22c55e; margin: 16px 0;">
  <strong>🌟 Imposter syndrome is actually a GOOD sign.</strong><br/><br/>
  It means you care deeply about doing this well. It means you take helping people seriously. It means you're not some arrogant know-it-all who thinks they have all the answers.
</p>

<p>You know who DOESN'T get imposter syndrome? People who don't care about quality. 🤷‍♀️</p>

<p><strong>The practitioners who struggle with self-doubt are often the BEST ones</strong> — because they're constantly learning, constantly improving, constantly asking <em>"How can I serve my clients better?"</em></p>

<p>Here's what I want you to remember:</p>

<ul style="margin: 16px 0; padding-left: 24px;">
  <li>✅ You don't need to know everything — you need to know <strong>more than your client</strong></li>
  <li>✅ You don't need a PhD — you need <strong>real-world experience and empathy</strong></li>
  <li>✅ You don't need to be "perfect" — you need to be <strong>present and committed</strong></li>
</ul>

<p><mark style="background: #fef08a; padding: 2px 4px; border-radius: 3px;">Your clients don't need a perfect practitioner. They need someone who GETS them.</mark></p>

<p>Someone who's walked their path. Someone who won't dismiss their symptoms. Someone who will actually LISTEN.</p>

<p><strong>That's you.</strong> 💪</p>

<p>So next time that little voice whispers <em>"Who are you to do this?"</em> — answer it:</p>

<p><em>"I'm someone who cares enough to doubt myself. And that's exactly why I'll be great at this."</em> ✨</p>

<p>Sarah M. 💕</p>
`,

  "Coaching Tip #3: You're Already an Expert (Just Not in Everything)": `
<p>Hi there! 💕</p>

<p>Let me introduce you to <strong>Diane</strong>.</p>

<p>Diane spent <mark style="background: #fef08a; padding: 2px 4px; border-radius: 3px;">15 years struggling with her weight</mark>. Every diet, every program, every "guaranteed" solution. She lost 40 pounds three separate times — and gained it all back.</p>

<p>Until she discovered functional medicine.</p>

<p>She learned about insulin resistance, gut health, stress hormones, and inflammation. She finally understood WHY her body held onto weight — and how to work WITH it instead of against it.</p>

<p>She lost the weight again. But this time? <strong>It stayed off.</strong> 🎉</p>

<p>Now here's the thing:</p>

<p>Diane doesn't know everything about functional medicine. She's not an expert in thyroid disorders. She couldn't write a paper on autoimmune conditions.</p>

<p><strong>But weight loss?</strong> <mark style="background: #bbf7d0; padding: 2px 4px; border-radius: 3px;">She's lived it. She's breathed it. She's cried over it.</mark></p>

<p>She knows:</p>

<ul style="margin: 16px 0; padding-left: 24px;">
  <li>💡 The shame of stepping on the scale</li>
  <li>💡 The confusion of conflicting advice</li>
  <li>💡 The frustration of doing "everything right" and still not seeing results</li>
  <li>💡 The JOY of finally finding something that works</li>
</ul>

<p>That lived experience? <strong>That's expertise.</strong></p>

<p style="padding: 16px; background: #fef3c7; border-left: 4px solid #f59e0b; margin: 16px 0;">
  <strong>🎯 Here's the secret:</strong><br/><br/>
  You don't need to be an expert in EVERYTHING. You need to be an expert in YOUR THING.
</p>

<p>What's the health challenge YOU'VE overcome?</p>

<ul style="margin: 16px 0; padding-left: 24px;">
  <li>🔥 Gut issues?</li>
  <li>🔥 Hormone imbalances?</li>
  <li>🔥 Chronic fatigue?</li>
  <li>🔥 Autoimmune challenges?</li>
  <li>🔥 Anxiety or depression?</li>
  <li>🔥 Thyroid problems?</li>
</ul>

<p><mark style="background: #fef08a; padding: 2px 4px; border-radius: 3px;">THAT'S your niche. THAT'S where you're already an expert.</mark></p>

<p>You don't need to help everyone. You need to help the people who are where YOU used to be.</p>

<p>They don't need a textbook expert. They need <strong>YOU</strong>. ✨</p>

<p>Sarah M. 💕</p>
`,

  "Coaching Tip #4: The Certification That Changes Everything": `
<p>Hi there! 💕</p>

<p>I need to be honest with you about something.</p>

<p>When I first started in functional medicine, I thought credentials didn't matter. <em>"I know what I'm doing,"</em> I told myself. <em>"Results speak for themselves."</em></p>

<p><strong>I was wrong.</strong> 😬</p>

<p>Here's what I learned the hard way:</p>

<ul style="margin: 16px 0; padding-left: 24px;">
  <li>❌ Potential clients asked about my qualifications — and I stumbled</li>
  <li>❌ Doctors wouldn't refer to me because I had no credentials</li>
  <li>❌ I constantly second-guessed myself: <em>"Am I really qualified to help this person?"</em></li>
  <li>❌ I undercharged because I didn't feel "official"</li>
</ul>

<p>The day I got certified? <mark style="background: #bbf7d0; padding: 2px 4px; border-radius: 3px;">Everything changed.</mark></p>

<ul style="margin: 16px 0; padding-left: 24px;">
  <li>✅ I spoke with confidence</li>
  <li>✅ I charged what I was worth</li>
  <li>✅ Clients trusted me immediately</li>
  <li>✅ Healthcare providers started sending referrals</li>
</ul>

<p style="padding: 16px; background: #f0fdf4; border-left: 4px solid #22c55e; margin: 16px 0;">
  <strong>🎓 A certification isn't just a piece of paper.</strong><br/><br/>
  It's PROOF that you've put in the work. It's PERMISSION to charge premium prices. It's CONFIDENCE that you know what you're doing.
</p>

<p>But here's the thing — <strong>not all certifications are created equal</strong>.</p>

<p>Some programs:</p>

<ul style="margin: 16px 0; padding-left: 24px;">
  <li>⚠️ Cost $6,000-$12,000</li>
  <li>⚠️ Take 2+ years to complete</li>
  <li>⚠️ Give you ONE certificate at the very end</li>
  <li>⚠️ Don't teach you how to actually GET clients</li>
</ul>

<p><mark style="background: #fef08a; padding: 2px 4px; border-radius: 3px;">That's why we do things differently here.</mark></p>

<p>You don't have to wait years to feel legitimate. You can start building your practice NOW — with credentials that grow alongside you. 💪</p>

<p>Sarah M. 💕</p>
`,

  "Coaching Tip #5: Start Before You're Ready": `
<p>Hi there! 💕</p>

<p>Quick story about <strong>Patricia</strong>.</p>

<p>Patricia completed her certification <mark style="background: #fef08a; padding: 2px 4px; border-radius: 3px;">14 months ago</mark>. She's taken 3 additional courses. Read 27 books. Watched hundreds of hours of videos. Attended 4 seminars.</p>

<p>Guess how many paying clients she has?</p>

<p><strong>Zero.</strong> 😔</p>

<p>Not because she's not good enough. Not because she doesn't know enough.</p>

<p>Because she's waiting to feel "ready."</p>

<p style="padding: 16px; background: #fef3c7; border-left: 4px solid #f59e0b; margin: 16px 0;">
  <strong>⚡ Here's the truth bomb:</strong><br/><br/>
  You will NEVER feel ready. The "ready" feeling doesn't exist. It's a myth we tell ourselves to stay safe.
</p>

<p>Every successful practitioner I know started before they felt ready:</p>

<ul style="margin: 16px 0; padding-left: 24px;">
  <li>🌟 They took their first client when they were terrified</li>
  <li>🌟 They made mistakes and learned from them</li>
  <li>🌟 They figured it out AS they went</li>
</ul>

<p>The confidence you're waiting for? <mark style="background: #bbf7d0; padding: 2px 4px; border-radius: 3px;">It comes FROM doing the work — not before.</mark></p>

<p>Think about learning to drive. Did you feel "ready" before your first lesson? No! You learned BY driving.</p>

<p><strong>Same thing here.</strong></p>

<p>Your first client doesn't need you to be perfect. They need you to:</p>

<ul style="margin: 16px 0; padding-left: 24px;">
  <li>✅ Listen to them</li>
  <li>✅ Care about their outcome</li>
  <li>✅ Know more than THEY do about their problem</li>
  <li>✅ Be committed to helping them</li>
</ul>

<p>That's it. You already have that. 💪</p>

<p><strong>Stop preparing. Start doing.</strong> ✨</p>

<p>Sarah M. 💕</p>
`,

  "Coaching Tip #6: Your First Client Is Closer Than You Think": `
<p>Hi there! 💕</p>

<p>Let me tell you about the first client I ever signed.</p>

<p>I was CONVINCED I needed to:</p>

<ul style="margin: 16px 0; padding-left: 24px;">
  <li>❌ Master Facebook ads</li>
  <li>❌ Build a fancy funnel</li>
  <li>❌ Create a beautiful website</li>
  <li>❌ Grow my Instagram to at least 10,000 followers</li>
</ul>

<p>Know where my first client actually came from?</p>

<p><mark style="background: #fef08a; padding: 2px 4px; border-radius: 3px;">My neighbor's sister.</mark></p>

<p>I mentioned at a BBQ that I was getting into health coaching. My neighbor said, <em>"Oh! My sister has been struggling with gut issues for years. Can I give her your number?"</em></p>

<p><strong>That's it.</strong> No ads. No funnel. No website. Just a conversation. 🎉</p>

<p style="padding: 16px; background: #f0fdf4; border-left: 4px solid #22c55e; margin: 16px 0;">
  <strong>🔑 The truth:</strong><br/><br/>
  Your first clients are already in your network. They're just waiting to hear that you can help them.
</p>

<p>Think about it:</p>

<ul style="margin: 16px 0; padding-left: 24px;">
  <li>👥 Your friends and family</li>
  <li>👥 Your coworkers (current and former)</li>
  <li>👥 Your neighbors</li>
  <li>👥 Parents at your kids' school</li>
  <li>👥 People at your gym, church, book club</li>
  <li>👥 Your social media connections</li>
</ul>

<p>Somewhere in that network is someone who:</p>

<ul style="margin: 16px 0; padding-left: 24px;">
  <li>💔 Is struggling with a health issue</li>
  <li>💔 Is frustrated with conventional medicine</li>
  <li>💔 Wants a different approach</li>
  <li>💔 Would LOVE to work with someone they trust</li>
</ul>

<p><strong>They just don't know you can help them yet.</strong></p>

<p><mark style="background: #bbf7d0; padding: 2px 4px; border-radius: 3px;">Your job this week: Tell 5 people what you're doing.</mark></p>

<p>Not a sales pitch. Just: <em>"I'm training to become a functional medicine health coach. I help women with [your specialty] find root causes and feel like themselves again."</em></p>

<p>Watch what happens. 💪</p>

<p>Sarah M. 💕</p>
`,

  "Coaching Tip #7: Your Transformation Story Is Your Greatest Marketing Tool": `
<p>Hi there! 💕</p>

<p>Today I have something special for you — <strong>a FREE resource that could change everything.</strong></p>

<p>But first, a quick story.</p>

<p>When I started posting on social media about functional medicine, I tried to sound "professional." I shared research studies. Posted about supplements. Used big medical words.</p>

<p><mark style="background: #fef08a; padding: 2px 4px; border-radius: 3px;">Crickets. 🦗</mark></p>

<p>Then one day, I shared MY story. My struggle with chronic fatigue. The years of being dismissed. The moment I finally found answers.</p>

<p>That post? <strong>87 comments. 200+ shares. And 4 people reached out asking how to work with me.</strong> 🎉</p>

<p style="padding: 16px; background: #f0fdf4; border-left: 4px solid #22c55e; margin: 16px 0;">
  <strong>💡 The lesson:</strong><br/><br/>
  People don't connect with credentials. They connect with STORIES. Especially stories that mirror their own.
</p>

<p>Your transformation story is your most powerful marketing tool because:</p>

<ul style="margin: 16px 0; padding-left: 24px;">
  <li>✨ It builds instant trust</li>
  <li>✨ It shows you UNDERSTAND their struggle</li>
  <li>✨ It proves transformation is possible</li>
  <li>✨ It's 100% unique to YOU</li>
</ul>

<p><strong>No one else has your story.</strong> That's your competitive advantage.</p>

<p>So here's your action step:</p>

<p><mark style="background: #bbf7d0; padding: 2px 4px; border-radius: 3px;">Write down your health transformation story this week.</mark></p>

<ul style="margin: 16px 0; padding-left: 24px;">
  <li>📝 Where were you before?</li>
  <li>📝 What was the turning point?</li>
  <li>📝 What changed?</li>
  <li>📝 Where are you now?</li>
</ul>

<p>This is GOLD. Use it everywhere — your bio, your social media, your discovery calls. 💪</p>

<p>Sarah M. 💕</p>
`,

  "Coaching Tip #8: Confidence Comes From Competence (Not More Studying)": `
<p>Hi there! 💕</p>

<p>Let me tell you about the day everything changed for me.</p>

<p>I was on my <strong>4th discovery call ever</strong>. Super nervous. Reviewed my notes 10 times beforehand. Had my scripts printed out and highlighted.</p>

<p>The call started... and <mark style="background: #fef08a; padding: 2px 4px; border-radius: 3px;">I completely blanked.</mark> 😬</p>

<p>I stumbled over my words. I forgot my questions. I probably said "um" about 47 times.</p>

<p>But you know what? <strong>She signed up anyway.</strong></p>

<p>Why? Because I listened. I cared. I was honest about wanting to help her.</p>

<p style="padding: 16px; background: #fef3c7; border-left: 4px solid #f59e0b; margin: 16px 0;">
  <strong>💡 The revelation:</strong><br/><br/>
  Confidence doesn't come from MORE studying. It comes from DOING — even when you're scared, even when it's messy.
</p>

<p>Think about it:</p>

<ul style="margin: 16px 0; padding-left: 24px;">
  <li>📚 Reading 10 more books won't make you confident</li>
  <li>📚 Watching 20 more videos won't make you confident</li>
  <li>📚 Taking another course won't make you confident</li>
</ul>

<p><strong>What WILL make you confident:</strong></p>

<ul style="margin: 16px 0; padding-left: 24px;">
  <li>✅ Having your first discovery call (even if you stumble)</li>
  <li>✅ Working with your first client (even if it's discounted)</li>
  <li>✅ Seeing your first client get results</li>
  <li>✅ Getting your first testimonial</li>
</ul>

<p><mark style="background: #bbf7d0; padding: 2px 4px; border-radius: 3px;">Competence → Confidence. Not the other way around.</mark></p>

<p>So stop waiting to feel confident before you start. Start now, and <strong>let the confidence build through experience.</strong> 💪</p>

<p>Your 10th call will be better than your 1st.<br/>
Your 50th will be better than your 10th.<br/>
Your 100th? You'll wonder why you were ever nervous.</p>

<p>But you have to start at call #1. ✨</p>

<p>Sarah M. 💕</p>
`,

  "Coaching Tip #9: The Power of \"I Don't Know\" (And Why It Builds Trust)": `
<p>Hi there! 💕</p>

<p>Want to know one of the BEST things you can say to a client?</p>

<p><mark style="background: #fef08a; padding: 2px 4px; border-radius: 3px;">"I don't know — let me research that and get back to you."</mark></p>

<p>I know, I know. It feels terrifying. But hear me out.</p>

<p>Last year, a client asked me about a specific supplement interaction I wasn't sure about. My old self would have:</p>

<ul style="margin: 16px 0; padding-left: 24px;">
  <li>❌ Pretended to know</li>
  <li>❌ Given a vague answer</li>
  <li>❌ Changed the subject</li>
</ul>

<p>Instead, I said: <em>"That's a great question. I want to give you the right answer, so let me look into it and follow up tomorrow."</em></p>

<p><strong>Her response?</strong></p>

<p><em>"I really appreciate that. My last doctor just guessed and it made things worse."</em> 🎯</p>

<p style="padding: 16px; background: #f0fdf4; border-left: 4px solid #22c55e; margin: 16px 0;">
  <strong>🔑 Here's the truth:</strong><br/><br/>
  Clients don't expect you to know everything. They expect you to be HONEST. And honesty builds more trust than fake expertise ever will.
</p>

<p>Saying "I don't know" shows:</p>

<ul style="margin: 16px 0; padding-left: 24px;">
  <li>✨ You're honest (not just telling them what they want to hear)</li>
  <li>✨ You're thorough (you'll research before answering)</li>
  <li>✨ You're humble (you don't have an ego to protect)</li>
  <li>✨ You're safe (they can trust you to be straight with them)</li>
</ul>

<p><mark style="background: #bbf7d0; padding: 2px 4px; border-radius: 3px;">It's actually a TRUST BUILDER, not a trust breaker.</mark></p>

<p>So next time you don't know something, don't panic. Don't fake it.</p>

<p>Just say: <em>"Let me look into that and get back to you with the right answer."</em></p>

<p>Then follow up. That's it. 💪</p>

<p>Sarah M. 💕</p>
`,

  "Coaching Tip #10: Celebrate Small Wins (Your Future Self Will Thank You)": `
<p>Hi there! 💕</p>

<p>Quick check-in: <strong>When was the last time you celebrated yourself?</strong></p>

<p>Be honest.</p>

<p>If you're like most women I work with, you immediately thought of something you HAVEN'T done yet. Some goal you're still chasing. 😔</p>

<p>We're SO good at:</p>

<ul style="margin: 16px 0; padding-left: 24px;">
  <li>❌ Minimizing our wins</li>
  <li>❌ Moving goalposts</li>
  <li>❌ Saying "yeah, but..." to every accomplishment</li>
</ul>

<p><mark style="background: #fef08a; padding: 2px 4px; border-radius: 3px;">This stops today.</mark></p>

<p style="padding: 16px; background: #f0fdf4; border-left: 4px solid #22c55e; margin: 16px 0;">
  <strong>🎯 Why celebration matters:</strong><br/><br/>
  When you celebrate wins — even tiny ones — you train your brain to notice progress. You build momentum. You create evidence that YOU CAN DO HARD THINGS.
</p>

<p><strong>Small wins to celebrate:</strong></p>

<ul style="margin: 16px 0; padding-left: 24px;">
  <li>🎉 You read this tip (you're investing in yourself!)</li>
  <li>🎉 You finished a module</li>
  <li>🎉 You told someone about your new path</li>
  <li>🎉 You had a discovery call (even if they didn't sign up)</li>
  <li>🎉 You showed up today when it was hard</li>
</ul>

<p>These matter. <strong>All of them.</strong></p>

<p>So here's your assignment:</p>

<p><mark style="background: #bbf7d0; padding: 2px 4px; border-radius: 3px;">Comment below with ONE thing you're proud of this week.</mark></p>

<p>It can be tiny. It can be "I didn't give up."</p>

<p>Let's celebrate each other. Because this journey is hard, and you deserve recognition for every step forward. 💪✨</p>

<p>Sarah M. 💕</p>
`,

  "Coaching Tip #11: The Power of Pilot Programs (Your Fast Track to Confidence)": `
<p>Hi there! 💕</p>

<p>Let me tell you about <strong>the smartest decision I ever made</strong> when starting out.</p>

<p>I didn't try to charge full price immediately. I didn't wait until I felt "ready."</p>

<p><mark style="background: #fef08a; padding: 2px 4px; border-radius: 3px;">I launched a pilot program.</mark></p>

<p>Here's what that looked like:</p>

<ul style="margin: 16px 0; padding-left: 24px;">
  <li>📋 I offered 3 spots at 50% off my intended price</li>
  <li>📋 I was upfront: "I'm building my practice and want feedback"</li>
  <li>📋 I asked for testimonials in exchange for the discount</li>
</ul>

<p><strong>Result?</strong></p>

<ul style="margin: 16px 0; padding-left: 24px;">
  <li>✅ 3 paying clients within 2 weeks</li>
  <li>✅ Real experience working with real people</li>
  <li>✅ Confidence I could actually DO this</li>
  <li>✅ 3 amazing testimonials for my website</li>
  <li>✅ Case studies to share with future clients</li>
</ul>

<p style="padding: 16px; background: #f0fdf4; border-left: 4px solid #22c55e; margin: 16px 0;">
  <strong>💡 Why pilot programs work:</strong><br/><br/>
  They remove the pressure. You're not claiming to be an expert. You're honestly saying, "I'm new, I'm committed, and I want to help you while building my skills."
</p>

<p>People LOVE supporting someone who's honest and hungry. They get a discount, you get experience. <strong>Everyone wins.</strong> 🎉</p>

<p><mark style="background: #bbf7d0; padding: 2px 4px; border-radius: 3px;">Your action step:</mark></p>

<p>Think about who in your network might be perfect for a pilot program. Who's been struggling with something you can help with?</p>

<p>Reach out this week. Make the offer. Watch what happens. 💪</p>

<p>Sarah M. 💕</p>
`,

  "Coaching Tip #12: The Discovery Call Blueprint (Step by Step)": `
<p>Hi there! 💕</p>

<p><em>"Sarah, how do I structure a discovery call? What do I even SAY?"</em></p>

<p>I hear this question constantly. And I get it — <mark style="background: #fef08a; padding: 2px 4px; border-radius: 3px;">discovery calls feel terrifying before you've done a few.</mark></p>

<p>Here's the exact blueprint I use:</p>

<p style="padding: 16px; background: #f0fdf4; border-left: 4px solid #22c55e; margin: 16px 0;">
  <strong>📞 THE DISCOVERY CALL BLUEPRINT</strong>
</p>

<p><strong>1. Build Rapport (2-3 minutes)</strong></p>
<ul style="margin: 12px 0; padding-left: 24px;">
  <li>👋 Warm greeting, thank them for their time</li>
  <li>💬 Quick personal connection ("How's your day going?")</li>
</ul>

<p><strong>2. Set the Agenda (1 minute)</strong></p>
<ul style="margin: 12px 0; padding-left: 24px;">
  <li>📋 "Here's what I'd love to do in our time together..."</li>
  <li>🎯 "I want to learn about you, share how I might help, and see if we're a good fit"</li>
</ul>

<p><strong>3. Their Story (10-15 minutes)</strong></p>
<ul style="margin: 12px 0; padding-left: 24px;">
  <li>❓ "Tell me what's going on with your health right now"</li>
  <li>❓ "How long has this been happening?"</li>
  <li>❓ "What have you tried so far?"</li>
  <li>❓ "How is this affecting your daily life?"</li>
</ul>

<p><strong>4. Your Approach (5-7 minutes)</strong></p>
<ul style="margin: 12px 0; padding-left: 24px;">
  <li>💡 Share your perspective on their situation</li>
  <li>✨ Explain how you work differently</li>
  <li>🛤️ Paint a picture of what's possible</li>
</ul>

<p><strong>5. The Offer (3-5 minutes)</strong></p>
<ul style="margin: 12px 0; padding-left: 24px;">
  <li>📦 Present your program</li>
  <li>💰 Share the investment</li>
  <li>❓ "Do you have any questions?"</li>
</ul>

<p><strong>6. The Close</strong></p>
<ul style="margin: 12px 0; padding-left: 24px;">
  <li>🎯 <mark style="background: #bbf7d0; padding: 2px 4px; border-radius: 3px;">"Based on everything we've talked about, this sounds like a great fit. Would you like to get started?"</mark></li>
</ul>

<p>That's it. Simple. Human. Effective. 💪</p>

<p>Sarah M. 💕</p>
`,

  "Coaching Tip #13: You Don't Need 10,000 Followers (Here's What You Actually Need)": `
<p>Hi there! 💕</p>

<p>I know you've been scrolling Instagram looking at coaches with massive followings, thinking:</p>

<p><em>"I'll never get clients with only 200 followers."</em> 😔</p>

<p>Let me tell you about <strong>Jen</strong>.</p>

<p>Jen had <mark style="background: #fef08a; padding: 2px 4px; border-radius: 3px;">180 Instagram followers</mark> when she signed her first $2,000 client.</p>

<p>180.</p>

<p>Not 10,000. Not 5,000. Not even 1,000.</p>

<p><strong>One hundred and eighty.</strong></p>

<p>How? She stopped trying to reach everyone and focused on <mark style="background: #bbf7d0; padding: 2px 4px; border-radius: 3px;">connecting deeply with the people already paying attention.</mark></p>

<p style="padding: 16px; background: #f0fdf4; border-left: 4px solid #22c55e; margin: 16px 0;">
  <strong>📊 The math:</strong><br/><br/>
  You don't need 10,000 followers to have a thriving practice.<br/><br/>
  You need: <strong>10-20 ideal clients per year.</strong><br/><br/>
  That's less than 2 clients per month.
</p>

<p>To get 2 clients per month, you need:</p>

<ul style="margin: 16px 0; padding-left: 24px;">
  <li>🎯 Maybe 4-6 discovery calls</li>
  <li>🎯 Which means 10-15 people showing interest</li>
  <li>🎯 Which means 50-100 people seeing your content</li>
</ul>

<p><strong>You already have that.</strong></p>

<p>Stop chasing followers. Start:</p>

<ul style="margin: 16px 0; padding-left: 24px;">
  <li>✅ Having real conversations in DMs</li>
  <li>✅ Responding to every comment</li>
  <li>✅ Creating content that speaks to ONE specific person</li>
  <li>✅ Building relationships, not an audience</li>
</ul>

<p><mark style="background: #fef08a; padding: 2px 4px; border-radius: 3px;">Quality > Quantity. Every single time.</mark> 💪</p>

<p>Sarah M. 💕</p>
`,

  "Coaching Tip #14: The Discovery Call Script That Actually Works": `
<p>Hi there! 💕</p>

<p>Today's a special one — <strong>I'm giving you my actual discovery call script!</strong></p>

<p style="padding: 16px; background: #fef3c7; border-left: 4px solid #f59e0b; margin: 16px 0;">
  <strong>🎁 FREE RESOURCE: Discovery Call Script + Objection Handlers</strong>
</p>

<p>After 200+ discovery calls, I've refined exactly what works. And today, I'm sharing it with you.</p>

<p><strong>The Opening:</strong></p>
<p><em>"Hi [name]! I'm so glad we could connect. Before we dive in, I'd love to hear — what made you reach out? What's going on that made you say 'I need to do something different'?"</em></p>

<p><strong>The Deep Dive Questions:</strong></p>
<ul style="margin: 16px 0; padding-left: 24px;">
  <li>🔍 <em>"How long has this been going on?"</em></li>
  <li>🔍 <em>"What have you already tried?"</em></li>
  <li>🔍 <em>"What would it mean for you if this was finally solved?"</em></li>
  <li>🔍 <em>"On a scale of 1-10, how ready are you to make a change?"</em></li>
</ul>

<p><strong>The Transition:</strong></p>
<p><em>"Based on everything you've shared, I really think I can help. Can I tell you a bit about how I work?"</em></p>

<p><strong>The Close:</strong></p>
<p><mark style="background: #bbf7d0; padding: 2px 4px; border-radius: 3px;"><em>"So, [name], it sounds like we're a great fit. I have a spot opening next week — would you like to get started?"</em></mark></p>

<p><strong>Common objection handlers:</strong></p>
<ul style="margin: 16px 0; padding-left: 24px;">
  <li>💰 <em>"I need to think about it"</em> → "Totally understand. What specifically do you want to think through? Maybe I can help clarify."</li>
  <li>⏰ <em>"I don't have time"</em> → "That makes sense. If we could find 30 minutes a week, would that feel doable?"</li>
  <li>💸 <em>"It's too expensive"</em> → "I hear you. What would solving this problem be worth to you?"</li>
</ul>

<p>Practice this. Role play with a friend. <strong>You'll be amazed at how confident you feel.</strong> 💪</p>

<p>Sarah M. 💕</p>
`,

  "Coaching Tip #15: The \"Who Do You Know\" Email (Gets You Referrals Today)": `
<p>Hi there! 💕</p>

<p>Let me share the email that got me <mark style="background: #fef08a; padding: 2px 4px; border-radius: 3px;">3 new clients last month</mark> — without ads, without social media, without a website.</p>

<p>I call it the <strong>"Who Do You Know" email.</strong></p>

<p>Here's exactly what I sent to 20 people in my network:</p>

<p style="padding: 16px; background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 8px; margin: 16px 0;">
<em>Subject: Quick favor? 🙏</em><br/><br/>
<em>Hey [name]!</em><br/><br/>
<em>I'm reaching out because I'm growing my functional medicine practice and looking for a few new clients who are struggling with [specific problem — gut issues, hormone imbalances, etc.].</em><br/><br/>
<em>I'm not asking you to hire me (unless you want to! 😄). I'm wondering — do you know anyone who:</em><br/><br/>
<em>• Has been frustrated with their doctor not taking their symptoms seriously?</em><br/>
<em>• Is tired of being told "everything looks normal" when they KNOW something's off?</em><br/>
<em>• Wants to find the root cause instead of just masking symptoms?</em><br/><br/>
<em>If anyone comes to mind, would you mind making an introduction? I'd be happy to offer them a free 15-minute chat to see if I can help.</em><br/><br/>
<em>Thanks so much! 💕</em><br/>
<em>[Your name]</em>
</p>

<p><strong>Why this works:</strong></p>
<ul style="margin: 16px 0; padding-left: 24px;">
  <li>✅ It's not salesy — you're asking for help, not pitching</li>
  <li>✅ It's specific — they can picture exactly who might fit</li>
  <li>✅ It's easy — they just make an introduction</li>
  <li>✅ It leverages trust — people trust referrals from friends</li>
</ul>

<p><mark style="background: #bbf7d0; padding: 2px 4px; border-radius: 3px;">Send this to 20 people this week. Watch what happens.</mark> 💪</p>

<p>Sarah M. 💕</p>
`,

  "Coaching Tip #16: Pricing Your First Offer (Without Panic)": `
<p>Hi there! 💕</p>

<p><em>"Sarah, what should I charge?"</em></p>

<p>I've heard this question hundreds of times. And here's what I've learned:</p>

<p><mark style="background: #fef08a; padding: 2px 4px; border-radius: 3px;">Most new practitioners underprice dramatically.</mark></p>

<p>Why? <strong>Fear.</strong></p>
<ul style="margin: 16px 0; padding-left: 24px;">
  <li>😰 Fear no one will pay</li>
  <li>😰 Fear of being seen as "greedy"</li>
  <li>😰 Fear of rejection</li>
</ul>

<p>But underpricing hurts you AND your clients. Here's why:</p>

<ul style="margin: 16px 0; padding-left: 24px;">
  <li>❌ You resent the work (because you're not being paid fairly)</li>
  <li>❌ Clients don't take it seriously (we value what we pay for)</li>
  <li>❌ You burn out (working too many hours for too little)</li>
</ul>

<p style="padding: 16px; background: #f0fdf4; border-left: 4px solid #22c55e; margin: 16px 0;">
  <strong>💰 My simple pricing framework:</strong><br/><br/>
  <strong>Pilot Program:</strong> $300-500 for 6-8 weeks<br/>
  <strong>Starting Rate:</strong> $100-150 per session<br/>
  <strong>Package Rate:</strong> $1,200-2,000 for 12 weeks<br/><br/>
  These are STARTING points. You'll raise them as you gain experience.
</p>

<p><strong>The mindset shift:</strong></p>

<p>You're not charging for your time. You're charging for:</p>
<ul style="margin: 16px 0; padding-left: 24px;">
  <li>✨ The TRANSFORMATION you provide</li>
  <li>✨ The years of learning you've done</li>
  <li>✨ The struggle you've overcome</li>
  <li>✨ The time they'll SAVE by working with you</li>
</ul>

<p><mark style="background: #bbf7d0; padding: 2px 4px; border-radius: 3px;">Price based on value, not hours.</mark> 💪</p>

<p>Sarah M. 💕</p>
`,

  "Coaching Tip #17: The Two Client Getting Activities (Focus Here First)": `
<p>Hi there! 💕</p>

<p>I see new practitioners spinning their wheels on things that <strong>DON'T</strong> get clients:</p>

<ul style="margin: 16px 0; padding-left: 24px;">
  <li>❌ Perfecting their website for 3 months</li>
  <li>❌ Creating a logo</li>
  <li>❌ Writing the perfect bio</li>
  <li>❌ Designing business cards</li>
  <li>❌ Building complicated funnels</li>
</ul>

<p><mark style="background: #fef08a; padding: 2px 4px; border-radius: 3px;">None of this gets clients.</mark></p>

<p>There are only <strong>TWO activities</strong> that actually bring paying clients:</p>

<p style="padding: 16px; background: #f0fdf4; border-left: 4px solid #22c55e; margin: 16px 0;">
  <strong>🎯 ACTIVITY #1: Have Conversations</strong><br/><br/>
  Talk to people about what you do. In person. On the phone. In DMs. On Zoom.<br/><br/>
  Real, human, one-on-one conversations.
</p>

<p style="padding: 16px; background: #fef3c7; border-left: 4px solid #f59e0b; margin: 16px 0;">
  <strong>🎯 ACTIVITY #2: Make Offers</strong><br/><br/>
  Actually invite people to work with you. Say the words: "Would you like to schedule a discovery call?"<br/><br/>
  No offer = No client. Ever.
</p>

<p><strong>That's it.</strong></p>

<p>Everything else is preparation. And preparation without action is just procrastination in disguise. 😬</p>

<p><mark style="background: #bbf7d0; padding: 2px 4px; border-radius: 3px;">Your goal this week:</mark></p>

<ul style="margin: 16px 0; padding-left: 24px;">
  <li>✅ Have 5 conversations about what you do</li>
  <li>✅ Make at least 2 offers (discovery call invitations)</li>
</ul>

<p>That's client-getting activity. Do this consistently and you WILL have clients. 💪</p>

<p>Sarah M. 💕</p>
`,

  "Coaching Tip #18: Why \"Free Consultations\" Should Never Feel Free": `
<p>Hi there! 💕</p>

<p>Let me flip something on its head for you.</p>

<p>When you offer a "free consultation," what do you think the client perceives?</p>

<p>Often: <em>"This must not be worth much if it's free."</em> 😔</p>

<p style="padding: 16px; background: #fef3c7; border-left: 4px solid #f59e0b; margin: 16px 0;">
  <strong>🔄 Here's the reframe:</strong><br/><br/>
  Your discovery call should feel like the <mark style="background: #fef08a; padding: 2px 4px; border-radius: 3px;">most valuable 30 minutes of their week.</mark>
</p>

<p><strong>Make it feel valuable by:</strong></p>

<ul style="margin: 16px 0; padding-left: 24px;">
  <li>✨ Actually listening (most doctors don't)</li>
  <li>✨ Asking questions no one's ever asked them</li>
  <li>✨ Connecting dots they hadn't considered</li>
  <li>✨ Giving them ONE actionable insight they can use today</li>
  <li>✨ Treating them like a human, not a number</li>
</ul>

<p>When they hang up thinking <em>"Wow, that was incredible — and it was FREE?"</em> they're much more likely to think:</p>

<p><strong><em>"Imagine what I'd get if I actually PAID her!"</em></strong> 🎯</p>

<p>This is the difference between a "free call" that feels cheap and a "discovery session" that demonstrates your value.</p>

<p><mark style="background: #bbf7d0; padding: 2px 4px; border-radius: 3px;">Your free call is a preview of working with you. Make it unforgettable.</mark> 💪</p>

<p>Sarah M. 💕</p>
`,

  "Coaching Tip #19: The Follow-Up Formula (Where Most Sales Actually Happen)": `
<p>Hi there! 💕</p>

<p><strong>True story:</strong></p>

<p>My biggest client ever — a <mark style="background: #fef08a; padding: 2px 4px; border-radius: 3px;">$4,500 program sale</mark> — came on the FIFTH follow-up.</p>

<p>The <em>fifth</em>.</p>

<p>If I'd stopped after the first "I need to think about it," I would have lost $4,500.</p>

<p style="padding: 16px; background: #f0fdf4; border-left: 4px solid #22c55e; margin: 16px 0;">
  <strong>📊 The stats:</strong><br/><br/>
  • 48% of salespeople never follow up<br/>
  • 80% of sales require 5+ follow-ups<br/>
  • Most people give up after 1-2 attempts
</p>

<p><strong>Why we don't follow up:</strong></p>
<ul style="margin: 16px 0; padding-left: 24px;">
  <li>😰 We don't want to be "annoying"</li>
  <li>😰 We take silence as rejection</li>
  <li>😰 We assume they're not interested</li>
</ul>

<p><strong>The reality?</strong> People are BUSY. They meant to respond. Life got in the way.</p>

<p><mark style="background: #bbf7d0; padding: 2px 4px; border-radius: 3px;">My Follow-Up Formula:</mark></p>

<ul style="margin: 16px 0; padding-left: 24px;">
  <li>📧 <strong>Day 2:</strong> "Just checking in! Did you have any questions?"</li>
  <li>📧 <strong>Day 5:</strong> Share a helpful resource related to their struggle</li>
  <li>📧 <strong>Day 10:</strong> "I have one spot left this month — is this still on your radar?"</li>
  <li>📧 <strong>Day 14:</strong> "No pressure at all. I'm here whenever you're ready."</li>
  <li>📧 <strong>Day 30:</strong> "Thinking of you! How are things going?"</li>
</ul>

<p>Following up isn't pushy. <strong>It's caring enough to stay connected.</strong> 💪</p>

<p>Sarah M. 💕</p>
`,

  "Coaching Tip #20: Celebrate Your First Paying Client (However Small)": `
<p>Hi there! 💕</p>

<p>When you get your first paying client — even if it's a $300 pilot client — <strong>I want you to do something for me.</strong></p>

<p style="padding: 16px; background: #f0fdf4; border-left: 4px solid #22c55e; margin: 16px 0;">
  <strong>🎉 CELEBRATE.</strong>
</p>

<p>Not "when I hit 10 clients."<br/>
Not "when I hit $5K months."<br/>
Not "when I feel like a real coach."</p>

<p><mark style="background: #fef08a; padding: 2px 4px; border-radius: 3px;">NOW. Your FIRST one.</mark></p>

<p>Because here's what that first client represents:</p>

<ul style="margin: 16px 0; padding-left: 24px;">
  <li>✨ Someone TRUSTED you with their health</li>
  <li>✨ Someone BELIEVED in your ability to help</li>
  <li>✨ Someone PAID you real money for your expertise</li>
  <li>✨ You are now officially a PAID practitioner</li>
</ul>

<p>That's HUGE. <strong>Do not minimize it.</strong></p>

<p><strong>How to celebrate:</strong></p>
<ul style="margin: 16px 0; padding-left: 24px;">
  <li>🥂 Tell someone you love</li>
  <li>🥂 Post about it here in the community</li>
  <li>🥂 Take yourself out for coffee</li>
  <li>🥂 Write it in your journal</li>
  <li>🥂 Screenshot the payment confirmation</li>
</ul>

<p>This moment matters. Don't rush past it. <mark style="background: #bbf7d0; padding: 2px 4px; border-radius: 3px;">Let it sink in.</mark></p>

<p>You did it. You're a health coach. FOR REAL. 💪🎉</p>

<p>Sarah M. 💕</p>
`,
};

// Generate remaining tips with similar style
function generateTip(num: number, title: string): string {
  // Use a template for tips we haven't manually written
  return `
<p>Hi there! 💕</p>

<p>Today we're diving into something important: <strong>${title.replace(`Coaching Tip #${num}: `, '')}</strong></p>

<p><mark style="background: #fef08a; padding: 2px 4px; border-radius: 3px;">This is a game-changer for so many practitioners.</mark></p>

<p>Here's what you need to know:</p>

<ul style="margin: 16px 0; padding-left: 24px;">
  <li>✨ Focus on progress, not perfection</li>
  <li>✨ Small steps lead to big transformations</li>
  <li>✨ Your unique perspective is your superpower</li>
</ul>

<p style="padding: 16px; background: #f0fdf4; border-left: 4px solid #22c55e; margin: 16px 0;">
  <strong>💡 Key takeaway:</strong><br/><br/>
  Remember — every successful practitioner started exactly where you are now. The difference? <mark style="background: #bbf7d0; padding: 2px 4px; border-radius: 3px;">They took action despite feeling uncertain.</mark>
</p>

<p>Your journey matters. Your experience matters. <strong>You matter.</strong> 💪</p>

<p>Sarah M. 💕</p>
`;
}

async function main() {
  console.log('🎨 Rewriting coaching tips with beautiful HTML...\n');

  const posts = await prisma.communityPost.findMany({
    where: { categoryId: 'coaching-tips' },
    select: { id: true, title: true }
  });

  console.log(`Found ${posts.length} coaching tips\n`);

  let updated = 0;

  for (const post of posts) {
    // Check if we have a manual version
    const htmlContent = COACHING_TIPS[post.title] || generateTip(
      parseInt(post.title.match(/#(\d+)/)?.[1] || '0'),
      post.title
    );

    await prisma.communityPost.update({
      where: { id: post.id },
      data: { content: htmlContent.trim() }
    });

    const isManual = !!COACHING_TIPS[post.title];
    console.log(`${isManual ? '✅' : '📝'} ${post.title.substring(0, 55)}...`);
    updated++;
  }

  console.log(`\n✅ Done! Updated ${updated} coaching tips with beautiful HTML.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
