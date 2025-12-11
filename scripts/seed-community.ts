import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcryptjs';
import 'dotenv/config';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// 175 US Women's names for students
const usWomenNames = [
  { first: "Jennifer", last: "Williams" },
  { first: "Amanda", last: "Thompson" },
  { first: "Jessica", last: "Garcia" },
  { first: "Ashley", last: "Martinez" },
  { first: "Stephanie", last: "Robinson" },
  { first: "Nicole", last: "Clark" },
  { first: "Melissa", last: "Rodriguez" },
  { first: "Michelle", last: "Lewis" },
  { first: "Elizabeth", last: "Lee" },
  { first: "Heather", last: "Walker" },
  { first: "Christina", last: "Hall" },
  { first: "Lauren", last: "Allen" },
  { first: "Rebecca", last: "Young" },
  { first: "Brittany", last: "Hernandez" },
  { first: "Amber", last: "King" },
  { first: "Danielle", last: "Wright" },
  { first: "Rachel", last: "Lopez" },
  { first: "Megan", last: "Hill" },
  { first: "Samantha", last: "Scott" },
  { first: "Katherine", last: "Green" },
  { first: "Crystal", last: "Adams" },
  { first: "Tiffany", last: "Baker" },
  { first: "Angela", last: "Gonzalez" },
  { first: "Kimberly", last: "Nelson" },
  { first: "Vanessa", last: "Carter" },
  { first: "Andrea", last: "Mitchell" },
  { first: "Courtney", last: "Perez" },
  { first: "Erica", last: "Roberts" },
  { first: "Shannon", last: "Turner" },
  { first: "Kelly", last: "Phillips" },
  { first: "Patricia", last: "Campbell" },
  { first: "Maria", last: "Parker" },
  { first: "Lisa", last: "Evans" },
  { first: "Sandra", last: "Edwards" },
  { first: "Nancy", last: "Collins" },
  { first: "Diana", last: "Stewart" },
  { first: "Catherine", last: "Sanchez" },
  { first: "Christine", last: "Morris" },
  { first: "Pamela", last: "Rogers" },
  { first: "Teresa", last: "Reed" },
  { first: "Natalie", last: "Cook" },
  { first: "Victoria", last: "Morgan" },
  { first: "Hannah", last: "Bell" },
  { first: "Emma", last: "Murphy" },
  { first: "Madison", last: "Bailey" },
  { first: "Olivia", last: "Rivera" },
  { first: "Abigail", last: "Cooper" },
  { first: "Sophia", last: "Richardson" },
  { first: "Isabella", last: "Cox" },
  { first: "Ava", last: "Howard" },
  { first: "Mia", last: "Ward" },
  { first: "Emily", last: "Torres" },
  { first: "Grace", last: "Peterson" },
  { first: "Chloe", last: "Gray" },
  { first: "Lily", last: "Ramirez" },
  { first: "Ella", last: "James" },
  { first: "Avery", last: "Watson" },
  { first: "Scarlett", last: "Brooks" },
  { first: "Aria", last: "Kelly" },
  { first: "Zoey", last: "Sanders" },
  { first: "Penelope", last: "Price" },
  { first: "Riley", last: "Bennett" },
  { first: "Layla", last: "Wood" },
  { first: "Nora", last: "Barnes" },
  { first: "Lucy", last: "Ross" },
  { first: "Evelyn", last: "Henderson" },
  { first: "Audrey", last: "Coleman" },
  { first: "Maya", last: "Jenkins" },
  { first: "Brooklyn", last: "Perry" },
  { first: "Leah", last: "Powell" },
  { first: "Hazel", last: "Long" },
  { first: "Violet", last: "Patterson" },
  { first: "Aurora", last: "Hughes" },
  { first: "Savannah", last: "Flores" },
  { first: "Claire", last: "Washington" },
  { first: "Skylar", last: "Butler" },
  { first: "Paisley", last: "Simmons" },
  { first: "Everly", last: "Foster" },
  { first: "Anna", last: "Gonzales" },
  { first: "Caroline", last: "Bryant" },
  { first: "Nova", last: "Alexander" },
  { first: "Genesis", last: "Russell" },
  { first: "Emilia", last: "Griffin" },
  { first: "Kennedy", last: "Diaz" },
  { first: "Maya", last: "Hayes" },
  { first: "Willow", last: "Myers" },
  { first: "Kinsley", last: "Ford" },
  { first: "Naomi", last: "Hamilton" },
  { first: "Aaliyah", last: "Graham" },
  { first: "Elena", last: "Sullivan" },
  { first: "Sarah", last: "Wallace" },
  { first: "Ariana", last: "Woods" },
  { first: "Allison", last: "Cole" },
  { first: "Gabriella", last: "West" },
  { first: "Alice", last: "Jordan" },
  { first: "Madelyn", last: "Owens" },
  { first: "Cora", last: "Reynolds" },
  { first: "Eva", last: "Fisher" },
  { first: "Serenity", last: "Ellis" },
  { first: "Autumn", last: "Harrison" },
  { first: "Gianna", last: "Gibson" },
  { first: "Hailey", last: "McDonald" },
  { first: "Valentina", last: "Cruz" },
  { first: "Luna", last: "Marshall" },
  { first: "Jade", last: "Ortiz" },
  { first: "Ivy", last: "Gomez" },
  { first: "Eleanor", last: "Murray" },
  { first: "Bella", last: "Freeman" },
  { first: "Sophie", last: "Wells" },
  { first: "Mackenzie", last: "Webb" },
  { first: "Piper", last: "Simpson" },
  { first: "Ruby", last: "Stevens" },
  { first: "Isla", last: "Tucker" },
  { first: "Madeline", last: "Porter" },
  { first: "Lydia", last: "Hunter" },
  { first: "Peyton", last: "Hicks" },
  { first: "Morgan", last: "Crawford" },
  { first: "Julia", last: "Henry" },
  { first: "Kylie", last: "Boyd" },
  { first: "Taylor", last: "Mason" },
  { first: "Jordyn", last: "Morales" },
  { first: "Sydney", last: "Kennedy" },
  { first: "Alexandra", last: "Warren" },
  { first: "Addison", last: "Dixon" },
  { first: "Lillian", last: "Ramos" },
  { first: "Natasha", last: "Reyes" },
  { first: "Jasmine", last: "Burns" },
  { first: "Destiny", last: "Gordon" },
  { first: "Brooke", last: "Shaw" },
  { first: "Faith", last: "Holmes" },
  { first: "Hope", last: "Rice" },
  { first: "Alexis", last: "Robertson" },
  { first: "Bailey", last: "Hunt" },
  { first: "Paige", last: "Black" },
  { first: "Morgan", last: "Daniels" },
  { first: "Jordan", last: "Palmer" },
  { first: "Kayla", last: "Mills" },
  { first: "Jenna", last: "Nichols" },
  { first: "Sara", last: "Grant" },
  { first: "Amy", last: "Knight" },
  { first: "Laura", last: "Ferguson" },
  { first: "Lindsay", last: "Rose" },
  { first: "Kate", last: "Stone" },
  { first: "Holly", last: "Hawkins" },
  { first: "Mary", last: "Dunn" },
  { first: "Karen", last: "Perkins" },
  { first: "Beth", last: "Hudson" },
  { first: "Anne", last: "Spencer" },
  { first: "Julie", last: "Gardner" },
  { first: "Wendy", last: "Stephens" },
  { first: "Dana", last: "Payne" },
  { first: "Dawn", last: "Pierce" },
  { first: "Melanie", last: "Berry" },
  { first: "Stacy", last: "Matthews" },
  { first: "Monica", last: "Arnold" },
  { first: "Veronica", last: "Wagner" },
  { first: "Jill", last: "Willis" },
  { first: "Carrie", last: "Ray" },
  { first: "Lindsey", last: "Watkins" },
  { first: "Erin", last: "Olson" },
  { first: "Casey", last: "Carroll" },
  { first: "Molly", last: "Duncan" },
  { first: "Becky", last: "Snyder" },
  { first: "April", last: "Hart" },
  { first: "Cindy", last: "Cunningham" },
  { first: "Cheryl", last: "Bradley" },
  { first: "Denise", last: "Lane" },
  { first: "Tracy", last: "Andrews" },
  { first: "Robin", last: "Ruiz" },
  { first: "Paula", last: "Harper" },
  { first: "Lori", last: "Fox" },
  { first: "Tara", last: "Riley" },
  { first: "Gina", last: "Armstrong" },
];

// Welcome posts for each category from Sarah
const welcomePosts = [
  {
    category: "introductions",
    title: "Welcome! Introduce Yourself Here!",
    content: `Hi everyone!

Welcome to our beautiful community! This is YOUR space to connect, share, and grow together.

I'd love to get to know each and every one of you! Please introduce yourself:

- What's your name and where are you from?
- What brought you to health coaching?
- What's your health journey story? (as much or as little as you'd like to share!)
- What do you hope to achieve here?
- One fun fact about yourself!

This community is built on vulnerability and support. The more we share, the more we connect. There's something magical about realizing you're not alone in your struggles and dreams.

I'll go first: I'm Sarah, and I started my health coaching journey after years of struggling with my own chronic health issues that doctors couldn't explain. What started as desperation to heal myself turned into a passion for helping other women who feel dismissed by the medical system. When I'm not coaching, you can find me hiking with my dog Luna or trying (and usually failing) at new recipes in the kitchen!

Can't wait to meet all of you!

With love, Sarah`,
  },
  {
    category: "wins",
    title: "Share Your Wins - Big or Small!",
    content: `Hey coaches!

This is THE place to celebrate every victory - no matter how "small" it might seem!

Why is celebrating wins so important?

1. It rewires your brain to notice progress
2. It builds confidence for the harder days
3. It inspires others who are a few steps behind you
4. It creates positive momentum
5. It reminds us why we started

Types of wins to share:
- Completed a module? WIN!
- Had a hard conversation? WIN!
- Signed your first client? HUGE WIN!
- Showed up when you didn't feel like it? WIN!
- Set a boundary? WIN!
- Raised your prices? WIN!
- Got a testimonial? WIN!
- Just showed up here today? That's a WIN too!

The rule: When you share a win, celebrate at least 2 other people's wins too. We rise by lifting each other!

I'll be here cheering you on every step of the way!

Let's see those wins! Sarah`,
  },
  {
    category: "tips",
    title: "Daily Coach Tips - Welcome!",
    content: `Hello wonderful coaches!

This is where I share daily tips, strategies, and insights to help you build a successful coaching practice.

What you'll find here:
- Practical business advice
- Mindset shifts that matter
- Scripts and templates
- Client success strategies
- Marketing without the "ick"
- And so much more!

I post new tips every day, so make sure you're checking in regularly. Each tip is designed to be actionable - something you can implement TODAY.

Feel free to:
- Ask questions on any tip
- Share how you implemented it
- Request specific topics
- Support each other in the comments

Remember: Knowledge without action is just entertainment. Let's take ACTION together!

Ready to grow? Sarah`,
  },
  {
    category: "questions",
    title: "Questions & Help - Ask Anything!",
    content: `Hey there!

Got a question? This is the place!

Whether you're stuck, confused, curious, or just need a sanity check - ask away!

Great questions to ask here:
- "How do I handle when a client says X?"
- "What's the best way to approach Y?"
- "Has anyone dealt with Z situation?"
- "Can someone explain this concept?"
- "I'm stuck on this module - help?"

Ground rules:
1. There are NO dumb questions
2. Be kind and supportive in responses
3. Share what worked for YOU (not prescriptive advice)
4. If you know the answer, jump in and help!
5. Tag me (@Sarah) if you need my input specifically

I check this feed daily and will jump in when I see questions I can help with. But also - your fellow coaches have SO much wisdom. Help each other!

This is a safe space to be confused, uncertain, and learning. That's literally why we're all here!

Ask away! Sarah`,
  },
  {
    category: "graduates",
    title: "Graduates Corner - You Made It!",
    content: `CONGRATULATIONS, GRADUATE!

If you can see this, you've completed the program and earned your certification. Take a moment to really let that sink in.

YOU DID IT.

This space is for:
- Celebrating your completion
- Sharing your post-graduation wins
- Mentoring newer students
- Connecting with fellow graduates
- Advanced discussions and strategies

As a graduate, you're now part of an elite group of certified health coaches. But your journey is just beginning!

Share below:
- How does it feel to be certified?
- What are your next steps?
- What was your biggest takeaway from the program?
- What advice would you give to students just starting?

I'm SO incredibly proud of each and every one of you. Watching you grow from uncertain students to confident coaches has been the greatest gift.

Now go change the world, one client at a time.

Always in your corner, Sarah`,
  },
];

// 30 Coaching Tips from the docx file
const coachingTips = [
  {
    title: "You Don't Need to Know Everything",
    content: `Hi there! Can I tell you a secret? On the day I got my first paying client, I was TERRIFIED. I thought I needed to have every answer memorized, every protocol perfected, every possible scenario prepared for.

Want to know what actually happened?

My client asked me a question I didn't know the answer to. And you know what I said? "That's a great question - let me research that and get back to you by tomorrow."

She didn't fire me. She didn't ask for a refund. She actually said, "I love that you're honest and thorough!"

Here's the truth: Your clients don't need you to be a walking encyclopedia. They need you to:
- Listen deeply to their struggles
- Care genuinely about their transformation
- Be honest when you don't know something
- Research and learn alongside them
- Show up consistently with your whole heart

You're not supposed to know everything on Day 1. You're supposed to be willing to learn, grow, and support your clients through their journey.

The certification gives you the foundation. Your heart and commitment give you everything else.

With belief in you, Sarah

YOUR TURN: What's the ONE question you're most afraid a client will ask you? Drop it in the comments - let's normalize not knowing everything!`,
  },
  {
    title: "Your First Client Is Closer Than You Think",
    content: `Hi! I know what you're thinking: "Who would actually pay ME for coaching?"

Let me paint you a picture of where your first client probably is right now:

- Your friend who always asks you for health advice
- Your coworker who saw you transform your own health
- Your sister who keeps saying "I wish I could figure out what you figured out"
- That person in your yoga class who mentioned their gut issues
- Your neighbor who's struggling with fatigue and "normal" labs

Your first client isn't a stranger who finds you through some perfect marketing funnel.

Your first client is someone who already knows you, trusts you, and has watched you either:
Transform your own health, OR
Show genuine care about helping people

Here's what's stopping you:
You're waiting for the "perfect" approach, the "right" time, the "complete" package.

But your first client just needs you to say: "Hey, I'm certified now. Can we talk about what you're going through?"

That's it. One conversation.

Your homework: Make a list of 5 people in your life who fit that description above. Don't reach out yet - just notice who they are.

You've got this! Sarah

YOUR TURN: Without naming names, describe your ideal first client in the comments. What are they struggling with? What keeps them up at night?`,
  },
  {
    title: "Imposter Syndrome Is a Sign You're Growing",
    content: `Hi there! Did you wake up today thinking: "Who am I to call myself a coach? I just finished this certification. I'm not qualified enough."

GOOD.

Wait, what? Good?!

Yes. Because that voice means you care deeply about doing this right. It means you have humility and integrity. It means you're taking this seriously.

Want to know who DOESN'T have imposter syndrome?
People who overestimate their abilities and charge into things recklessly. (We've all met them, right?)

Here's what I've learned after working with thousands of students:

The ones who feel "not ready enough" often become the BEST coaches. Why?
- They study more thoroughly
- They listen more carefully to clients
- They stay humble and keep learning
- They refer out when appropriate
- They build trust through authenticity

Your imposter syndrome isn't a stop sign. It's a compass showing you're heading in the right direction.

The antidote to imposter syndrome isn't waiting until you feel "ready enough."
It's taking action DESPITE the fear and watching yourself rise to meet the moment.

Every single graduate before you felt this way. And every single one who pushed through it now has a thriving practice.

You're exactly where you need to be.

With confidence in you, Sarah

ACCOUNTABILITY MOMENT: On a scale of 1-10, where's your imposter syndrome TODAY?
Drop a number below - no shame, no judgment. We've ALL been there.`,
  },
  {
    title: "Stop Waiting for the Perfect Niche",
    content: `Hi! Let me guess - you've spent hours (maybe days?) trying to figure out your "perfect niche":

"Should I focus on hormone health? Gut health? Autoimmune?"
"What if I pick wrong and no one wants to work with me?"
"What if I box myself in and can't help other people?"

I'm about to save you weeks of overthinking:

Start with the health journey YOU lived.

That's it. That's the answer.

Did you heal your own:
- Gut issues? Coach people with gut issues
- Hormone imbalances? Coach people with hormone chaos
- Chronic fatigue? Coach exhausted people dismissed by doctors
- Autoimmune condition? Coach people navigating autoimmunity
- Nothing specific but love research? Start with whoever shows up first

Why does starting with YOUR story work?
- You deeply understand their pain
- You know the emotional rollercoaster they're on
- You've already researched solutions (years of Googling = expertise!)
- Your story becomes your most powerful marketing
- You'll attract people who see themselves in you

Your niche will refine itself as you work with real clients. You don't need to architect it perfectly before you begin.

Let it be simple.
Sarah

YOUR TURN: Fill in that blank in the comments! "I help _____ with _____ so they can _____."
Even if it's messy, even if you'll change it later - just WRITE something. Let's practice!`,
  },
  {
    title: "Your Transformation Story IS Your Credibility",
    content: `FREEBIE FRIDAY

Hi there! Every Friday, I drop ONE premium resource for free to celebrate your hard work this week.

But first, let's talk about your most powerful marketing tool:
Your personal health transformation story.

I need to tell you something that might surprise you:
Your story is worth more than any certification letters after your name.

Credentials matter. (That's why you're here!)
But here's what actually makes potential clients say "I want to work with HER":

"She's been where I am. She gets it. She figured it out. Maybe she can help me too."

Let me show you the difference:

Version 1 (Credential-focused):
"I'm a certified Integrative Health Coach with credentials from CMA, IPHM, ICAHP, and IAOTH."

Version 2 (Transformation-focused):
"Three years ago, I was exhausted, bloated, and dismissed by doctors who said my labs were 'normal.' I knew something was wrong. After healing myself through functional medicine, I became a certified coach to help women who feel gaslit by the medical system finally get answers and feel like themselves again."

Which one made you FEEL something?

Your story includes:
- Where you were (the struggle people relate to)
- What you tried that didn't work (shows you understand their frustration)
- What finally worked (gives them hope)
- Why you're passionate about helping others (proves you genuinely care)

Someone out there is struggling with EXACTLY what you overcame.
And when they hear your story, they'll think: "Finally, someone who understands."

That's when they become your client.

Own your story! Sarah

GRATITUDE CHAIN: If this helps you, comment below with one powerful sentence from YOUR transformation story.
Let's practice vulnerability and cheer each other on!`,
  },
  {
    title: "You Can Start Coaching BEFORE Your Website Is Perfect",
    content: `Hi! Let me guess where you are right now:

You've been researching website builders for hours. Choosing color schemes. Writing and rewriting your About page. Freaking out about photography. Comparing yourself to coaches who have these gorgeous, polished sites.

And meanwhile... you haven't talked to a single potential client.

Can I give you some tough love wrapped in encouragement?

You don't need a website to get your first 3-5 clients.

I know that feels wrong. I know you want everything "professional" before you start. But here's the truth:

Your first clients will come from:
- Conversations (not your website)
- Relationships (not SEO)
- Referrals (not your Instagram aesthetic)
- Your story (not your logo)

Here's what you ACTUALLY need to start coaching RIGHT NOW:
- A way to schedule calls - Calendly free version (10 minutes to set up)
- A way to get paid - Venmo, PayPal, Stripe (you already have one)
- A way to communicate - Zoom, email, phone (you have this too)
- Your certification - Check! You're here!
- Someone who needs help - They're already in your life

That's it. You literally have everything you need TODAY.

"But Sarah, don't I need to look professional?"

Yes! But professionalism comes from:
- Showing up on time
- Listening deeply to what they're actually saying
- Following through on what you promise
- Getting your clients actual, measurable results
- Communicating clearly and confidently

A beautiful website doesn't make you professional. Your integrity and results do.

Get out there! Sarah

YOUR TURN: What's ONE thing you're doing this week instead of building a website? Drop it below - then DO IT!`,
  },
  {
    title: "Weekly Wins Thread",
    content: `WEEKLY WINS THREAD

Happy Sunday, coaches!

Before we dive into next week, let's CELEBRATE what you accomplished this week!

I don't care if your wins feel "small" - they're not. Every single step forward matters.

Drop your wins below:
- Completed a module?
- Had a scary conversation?
- Posted your story for the first time?
- Scheduled a discovery call?
- Told someone you're a coach?
- Downloaded Friday's freebie?
- Filled in your niche statement?
- Set up your Calendly?
- Reached out to someone about coaching?
- Just showed up here every day even when you felt scared?

ALL of it counts. ALL of it matters. ALL of it is moving you forward.

Comment below with at least ONE win and let's HYPE EACH OTHER UP!

I'm reading every single one and celebrating with you!

The 3 most inspiring wins this week get:
- Featured in tomorrow's Community Spotlight
- A personal voice note from me
- A surprise bonus resource

See you tomorrow with the pricing guide! Sarah

DROP YOUR WINS BELOW!
And reply to at least 2 other people's wins with genuine encouragement. When we celebrate each other, we ALL rise!`,
  },
  {
    title: "How to Price Your Services Without Undervaluing Yourself",
    content: `Hi there! Okay, let's talk about the question that's been keeping you up at night:

"How much should I charge?"

I see this happen ALL the time with new coaches:
"Maybe I'll charge $50/session since I'm new?"
"I don't want to seem greedy..."
"Who would pay ME $200? I just got certified!"
"I'll start low and raise my prices later..."

Let me be really direct with you:
Undercharging doesn't help your clients - it hurts them.

Why? Because when someone pays $25 for coaching, they don't take it seriously. They cancel. They don't do the work. They don't show up. They don't get results.

But when someone invests real money? They show up. They commit. They do the homework. They transform.

Your pricing communicates your value.

Here's what I recommend for NEW coaches:

For your first 3-5 pilot clients: Offer a 4-week intensive at a discounted rate in exchange for detailed feedback and testimonials.

After your pilots:
- Single sessions: Start at $150-250
- Packages: $800-2000 for 8-12 weeks

"But Sarah, that feels SO high! No one will pay that!"

Wrong. Here's why:
- People spend $200/month on supplements that don't work
- They spend $150 on facials that last 2 hours
- They spend $300/month on meal delivery services
- But they won't invest in actually FIXING their health?

Your services are MORE valuable than any of those things.

You're not selling an hour. You're selling transformation.

Price like the professional you are! Sarah

YOUR TURN: What are you charging right now? (Or planning to charge?) Drop it below - no judgment, just curiosity!
Let's normalize talking about money as a community.`,
  },
  {
    title: "What to Say on Your First Discovery Call",
    content: `Hi! Okay, this is it - you've got your first discovery call scheduled.

Your palms are sweating. Your mind is racing. You're wondering:
"What do I even SAY?"
"What if they ask something I don't know?"
"How do I 'sell' without being pushy?"
"What if they don't want to work with me?"
"When do I talk about money?!"

Take a breath. I've got you.

Here's the structure that works:

1. Connection (5 minutes):
"Thanks so much for taking time to chat! Before we dive in, tell me a little about yourself - what brought you to look for a coach right now?"
Listen. Don't interrupt. Take notes.

2. Deep Dive into Their Struggle (15 minutes):
"Walk me through what you've already tried... what's been most frustrating... how is this impacting your daily life?"
Let them vent. Ask clarifying questions. Show genuine empathy.

3. Paint the Vision (5 minutes):
"If we worked together and 3 months from now you were feeling amazing - what would that look like? What would be different?"
Let THEM describe success. You're not selling - you're listening.

4. Share How You Can Help (10 minutes):
"Based on what you've shared, here's how I'd approach this... [outline your process]... Does this resonate with you?"
Be specific. Connect dots between their symptoms and root causes.

5. Discuss Investment (5 minutes):
"My 4-week program is [your price] and includes [details]. Does that feel aligned for you?"
State your price confidently. Then STOP TALKING. Let them respond.

The secret sauce?
You're not convincing them to work with you. You're discovering if you're a good fit for each other.

You've got this! Sarah

YOUR TURN: What's your biggest fear about discovery calls? Drop it below - let's troubleshoot together as a community!`,
  },
  {
    title: "The Power of Pilot Programs",
    content: `Hi there! Let me tell you about the smartest thing I ever did when I started coaching:

I offered pilot programs.

"Sarah, what's a pilot program?"

Great question! A pilot program is:
- A discounted coaching package (usually 50-60% off your eventual rate)
- For your first 3-5 clients only
- In exchange for detailed feedback and a testimonial
- A chance to refine your process before "officially" launching

Why pilot programs are GENIUS:

1. They remove your imposter syndrome: You're not claiming to be a perfect expert - you're upfront that you're refining your approach. Clients appreciate the honesty and feel special being part of it!

2. They lower the barrier for your first clients: Instead of asking someone to invest $1500, you're offering $400-500. Much easier yes!

3. You get REAL experience: Nothing teaches you faster than working with actual humans with actual problems.

4. You build a testimonial library: These success stories become your most powerful marketing FOREVER.

5. You refine your process: You'll discover what works, what doesn't, what your clients need most, and how to structure your offers going forward.

How to structure a pilot program:

"4-Week Health Transformation - Pilot Program"
What's included:
- 4 one-on-one sessions (weekly)
- Email support between sessions
- Personalized protocol and action plan
- Resources and tracking tools

Your investment: [Your discounted rate - roughly 50% off what you'll eventually charge]

What I need from you:
- Honest feedback after each session
- Written testimonial at the end
- Before/after metrics
- Active participation in refining the program

Ready to launch your pilot program? Sarah

YOUR TURN: Who's ready to offer a pilot program? Comment "I'M IN!" below and tell us your niche!`,
  },
  {
    title: "You Don't Need a Big Social Media Following",
    content: `Hi! I know you've been scrolling through Instagram looking at coaches with 50K followers, thinking:

"I'll never get clients with only 247 followers. I need to build my audience first."

Let me stop you right there.

You don't need thousands of followers to build a thriving coaching practice.

You need 10-20 people who actually know, like, and trust you.

Here's the math that matters:
- 10,000 followers who scroll past your posts
vs.
- 50 engaged people who read, comment, and actually DM you

- Posting 3x/day to "grow your audience"
vs.
- Having 3 real conversations with potential clients

Real story from one of our students:
Jen had 180 Instagram followers when she signed her first client. Then her second. Then her third.

Six months later, she was fully booked with a waiting list - still under 400 followers.

How?
- She posted her transformation story authentically (not perfectly)
- She engaged meaningfully in comments (not just dropping emojis)
- She answered DMs thoughtfully (treating each person like a human)
- She offered valuable content without constantly pitching
- She asked satisfied clients for referrals

Here's what actually gets you clients:
- Depth of connection (not breadth of reach)
- Quality conversations (not viral posts)
- Trust building (not follower count)
- Showing up consistently (not showing up perfectly)

Your action step THIS WEEK:
Stop obsessing over follower count. Start obsessing over connection depth.

You're enough, exactly as you are.
Sarah

YOUR TURN: How many followers do you have right now? Drop the number below - let's prove that size doesn't matter!`,
  },
  {
    title: "Client Onboarding Email Scripts",
    content: `FREEBIE FRIDAY

Hi there! Happy Friday! Time for this week's premium resource drop.

Last week you got: Your Transformation Story Script
This week: Client Onboarding Email Sequence

Here's a scenario:
Someone just said YES to working with you. You're excited! They're excited!

Then you panic...
"What do I send them now? What comes next? How do I make this feel professional?"

Most new coaches wing it:
- Send random emails as things come up
- Forget important information
- Miss opportunities to build excitement
- Look disorganized

Professional coaches have a SYSTEM:
- Automated welcome sequence
- Clear communication at every step
- Clients feel taken care of from day 1
- You look like you've done this 100 times (even if it's your first!)

THIS WEEK'S FREEBIE: Client Onboarding Email Sequence (5 Copy-Paste Emails)

This includes:
Email 1: Welcome Email (sent immediately after they sign up)
Email 2: Intake Form Reminder (sent 24 hours later if not completed)
Email 3: Pre-Session Prep (sent 3 days before first session)
Email 4: Session Confirmation (sent day before)
Email 5: Post-Session Follow-Up (sent after first session)

PLUS bonus templates for:
- Payment reminder emails
- Rescheduling request response
- "Thanks for your testimonial" email

Zero writing required. Just customize with your details and hit send.

Make your clients feel like VIPs from day 1! Sarah

GRATITUDE CHAIN: If these templates save you time and stress, comment below with "THANK YOU!"
And tag someone in the community who just signed their first client - they need this!`,
  },
  {
    title: "How to Handle 'I Need to Think About It'",
    content: `Hi there! You just had an amazing discovery call. The potential client seemed SO into it. They loved everything you said. They nodded along. They shared their struggles. They seemed ready.

And then...

"This sounds great, but I need to think about it."

Your heart sinks. You freeze. You say "Okay, no problem! Take your time!" and hang up feeling defeated.

Sound familiar?

Here's the truth:
"I need to think about it" is almost NEVER about needing to think about it.

It's usually one of these:
1. They're worried about the money
2. They're not sure if they're ready to commit
3. They don't believe it will work for them
4. They have a spouse/partner they need to discuss it with
5. They have questions they're afraid to ask

Here's how to respond:

"I totally understand. What specifically would you like to think about? I'm happy to clarify anything while we're on the call."

This gives them permission to share their REAL concern.

Common responses and how to handle them:

"It's a lot of money..."
"I hear you. Investment in your health is significant. Can I ask - what is your current health situation costing you? In energy? Productivity? Quality of life?"

"I'm not sure I'm ready..."
"What would 'ready' look like for you? Sometimes the best time to start is exactly when we feel least ready."

"I need to talk to my spouse..."
"Absolutely! What do you think their main questions will be? I can give you talking points to share with them."

The key? Stay curious, not defensive.
When you understand their real objection, you can address it.

And sometimes the answer is genuinely "not now" - and that's okay too. Not everyone is your client.

You've got this! Sarah

YOUR TURN: What's your go-to response when someone says "I need to think about it"? Share below!`,
  },
  {
    title: "Weekly Wins Thread - Week 2",
    content: `WEEKLY WINS THREAD - WEEK 2

Happy Sunday, coaches!

Another incredible week in the books! Let's celebrate before we dive into Week 3!

Drop your wins below:
- Had a discovery call?
- Signed a pilot client?
- Posted on social media?
- Created your pricing?
- Practiced your discovery call script?
- Talked about money confidently?
- Handled an objection?
- Finished a course module?
- Made a list of potential clients?
- Sent a scary email or DM?

Remember: Every action, no matter how small, is building your coaching business!

I'm reading every single win and celebrating with you!

What's coming in Week 3:
- MONDAY: Creating boundaries with clients
- TUESDAY: The follow-up formula
- WEDNESDAY: How to ask for testimonials
- THURSDAY: Building a referral engine
- FRIDAY: FREEBIE - Testimonial Request Scripts
- SATURDAY: Dealing with difficult clients
- SUNDAY: Weekly wins + Week 4 preview

Let's go! Sarah

DROP YOUR WINS BELOW!`,
  },
  {
    title: "Creating Healthy Boundaries with Clients",
    content: `Hi there! Let's talk about something that will make or break your coaching business:

Boundaries.

I know, I know. When you're starting out, you want to be EVERYTHING to everyone. Available 24/7. Responding to texts at midnight. Squeezing in extra calls because they "really need you."

Here's what I've learned the hard way:
Poor boundaries = burnout + resentment + poor results for clients

When you're always available, clients don't develop independence.
When you over-give, you under-deliver (because you're exhausted).
When you have no structure, clients don't feel safe.

Healthy boundaries actually HELP your clients:
- They learn to trust themselves between sessions
- They develop self-advocacy skills
- They respect your time (and their own)
- They see you as a professional, not a friend

Here are boundaries I recommend:

COMMUNICATION:
- Set specific response times (e.g., "I respond to emails within 24 hours on business days")
- No texting unless it's for scheduling
- Emergency protocol in place (what qualifies as an emergency?)

SCHEDULING:
- Sessions happen at scheduled times only
- Clear cancellation/reschedule policy (48 hours notice)
- No "just a quick call" outside sessions

SCOPE:
- You're their coach, not their therapist
- Know when to refer out
- Don't diagnose or prescribe

The best coaches I know have the clearest boundaries.

Your boundaries are a gift to your clients - they create the container for transformation.

Sarah

YOUR TURN: What boundary do you struggle with most? Let's troubleshoot together!`,
  },
  {
    title: "The Follow-Up Formula That Actually Works",
    content: `Hi! Let's talk about the thing most new coaches HATE doing:

Following up.

You had a great discovery call. They said "I'll think about it." You hung up... and then what?

Most coaches do one of two things:
1. Never follow up (out of fear of being "pushy")
2. Follow up once, get no response, and give up

Both of these leave money on the table.

Here's the truth:
People are BUSY. They meant to respond. They got distracted. They forgot.

Following up is not pushy. It's professional.

Here's my proven follow-up formula:

DAY 1 (same day as call):
Send a brief thank-you email recapping what you discussed and next steps.

DAY 3:
"Just checking in! Did you have any other questions I can answer for you?"

DAY 7:
"Hi [Name]! I wanted to reach out one more time. I know how busy life gets! If you're still interested in working together, I'd love to help you [specific result they wanted]. If the timing isn't right, no worries at all - just let me know and I'll close out your file. Either way, I'm rooting for you!"

The last email is key because it:
- Gives them an easy out (no guilt)
- Creates gentle urgency
- Shows you're organized and professional
- Often prompts a response either way

What NOT to do:
- Follow up more than 3 times
- Be guilt-trippy or desperate
- Change your offer or drop your price

Your follow-up energy matters. Be confident, helpful, and unattached to the outcome.

Sarah

YOUR TURN: What's your biggest block around following up? Share below!`,
  },
  {
    title: "How to Ask for Testimonials (Without Feeling Awkward)",
    content: `Hi there! One of the most powerful assets in your coaching business is testimonials.

But asking for them can feel SO awkward, right?

"What if they don't want to?"
"What if they didn't get results?"
"Isn't it weird to ask?"

Here's the truth:
Happy clients WANT to help you. They're grateful. They want to share their experience. You just need to make it easy for them.

When to ask:
- Right after they hit a milestone
- At the end of your program
- After they share a win with you
- When they spontaneously compliment you

How to ask:

Option 1 - In person/on call:
"I'm so proud of the progress you've made! Would you be willing to share a brief testimonial? It would mean so much to me and could really help other women who are struggling like you were."

Option 2 - Via email:
"Hi [Name]! I'm so grateful for the work we've done together. As I continue to grow my practice, testimonials from clients like you make such a difference. Would you be open to sharing a few sentences about your experience? I'd be happy to send you a few prompts if that would help!"

The prompts that get GREAT testimonials:
1. What were you struggling with before we started working together?
2. What results have you experienced?
3. What surprised you most about our work together?
4. Who would you recommend this to?

Pro tip: Offer to write it FOR them based on their answers. Many clients love this because it's easier.

Video testimonials are gold - but written ones work great too!

Sarah

YOUR TURN: Who's ready to ask for their first testimonial this week? Comment "I'M ASKING!" below!`,
  },
  {
    title: "Building a Referral Engine",
    content: `Hi! Want to know the easiest way to grow your coaching business?

Referrals.

No ads. No funnels. No dancing on TikTok.

Just happy clients telling other people about you.

Here's the thing:
Your clients probably WANT to refer you. They just don't know how.

Your job is to make it easy.

How to ask for referrals:

During the program:
"If you know anyone else who's struggling with [what they came to you for], I'd love to help them too. Feel free to share my info!"

At the end:
"I grow my practice primarily through referrals from happy clients. If anyone comes to mind who could benefit from this work, I'd be so grateful if you'd connect us!"

After they refer someone:
"Thank you SO much for referring [Name]! As a thank you, I'd love to [gift/bonus]."

Create a referral incentive:
- Free session for each referral
- Discount on their next package
- Gift card to their favorite place
- Entry into a monthly drawing

Make it easy to refer you:
- Give them your scheduling link to share
- Create a simple one-liner they can text
- Offer to send a intro email template

Example one-liner:
"My health coach [Your Name] helped me [result]. She's amazing if you're struggling with [problem]. Here's her link: [link]"

The simpler you make it, the more referrals you'll get.

Sarah

YOUR TURN: What referral incentive would you offer? Share your ideas below!`,
  },
  {
    title: "Testimonial Request Scripts",
    content: `FREEBIE FRIDAY

Hi there! Happy Friday! Time for this week's free resource!

Last week: Client Onboarding Emails
This week: Testimonial Request Scripts

Let's be real - asking for testimonials can feel awkward.

But testimonials are GOLD for your business:
- Social proof for new clients
- Content for your website and social media
- Confidence booster for YOU
- Referral generator

This freebie includes:

SCRIPT 1: The In-Session Ask
Use this when they share a win during your call.

SCRIPT 2: The End-of-Program Ask
Use this in your final session or follow-up email.

SCRIPT 3: The Check-In Ask
Use this when following up with past clients.

SCRIPT 4: The Prompts Email
Send this to clients who say yes but don't know what to write.

SCRIPT 5: The Video Request
Use this when asking for video testimonials.

PLUS:
- What to do when they say "I don't know what to say"
- How to follow up without being pushy
- How to use testimonials legally (permission templates included!)

Get asking! Sarah

CHALLENGE: Ask for ONE testimonial this week. Comment "I DID IT!" when you do!`,
  },
  {
    title: "Dealing with Difficult Clients",
    content: `Hi there! Let's talk about something no one tells you when you start coaching:

Not every client will be a dream to work with.

Some clients will:
- Not do the work between sessions
- Show up late or cancel last-minute
- Push back on everything you suggest
- Be negative or draining
- Expect you to "fix" them

Here's what to remember:
This is NOT a reflection of you or your coaching skills.

How to handle it:

THE NON-COMPLIANT CLIENT:
They don't do the homework. They don't implement.
Response: "I notice we keep discussing the same things. Help me understand what's getting in the way of taking action. Is there something we need to adjust?"

THE CHRONIC CANCELER:
They cancel or reschedule constantly.
Response: Enforce your cancellation policy. "Per our agreement, sessions canceled with less than 48 hours notice are forfeited. I'm happy to continue our work together if you can commit to showing up."

THE BOUNDARY PUSHER:
They text at midnight, want extra calls, don't respect your time.
Response: "I care about supporting you AND maintaining boundaries that allow me to show up fully. Let's find a way to address your needs within our agreed structure."

THE ENERGY DRAINER:
Every session feels heavy, negative, resistant.
Response: Sometimes you need to refer out. "I want what's best for you. I think you might benefit from working with a therapist in addition to our coaching work."

It's okay to fire a client.
Your energy is precious. Your peace matters.

Not everyone is meant to be YOUR client.

Sarah

YOUR TURN: What's your biggest challenge with difficult clients? Let's problem-solve together!`,
  },
  {
    title: "Weekly Wins Thread - Week 3",
    content: `WEEKLY WINS THREAD - WEEK 3

Happy Sunday, coaches!

Week 3 is in the books! Time to celebrate!

Drop your wins below:
- Set a new boundary?
- Followed up with a lead?
- Asked for a testimonial?
- Got a referral?
- Handled a difficult situation?
- Had a breakthrough with a client?
- Posted consistently on social media?
- Signed a new client?
- Created a new offer or package?

Every step forward counts!

What's coming in Week 4:
- MONDAY: Building your support system
- TUESDAY: Self-care for coaches
- WEDNESDAY: When to raise your prices
- THURSDAY: Creating recurring revenue
- FRIDAY: FREEBIE - Price Increase Script
- SATURDAY: Planning your next 90 days
- SUNDAY: Month 1 celebration!

We're almost through our first month together!

Sarah

DROP YOUR WINS BELOW!`,
  },
  {
    title: "Building Your Support System",
    content: `Hi there! Here's something I wish someone had told me when I started:

You cannot build a coaching business alone.

I tried. I really tried. And I burned out HARD.

Here's what you need in your corner:

1. A MENTOR/COACH
Someone who's further along than you. Who can see your blind spots. Who can shortcut your learning curve.

2. PEER SUPPORT
Other coaches at your level. People who GET IT. Who you can vent to, brainstorm with, celebrate with.

3. BUSINESS SUPPORT
An accountant. A lawyer (eventually). A tech person when something breaks.

4. PERSONAL SUPPORT
Friends and family who believe in you. Who remind you why you started.

5. SELF-SUPPORT
Your own practices. Journaling. Meditation. Movement. Whatever fills YOUR cup.

You might be thinking: "I can't afford a coach right now."

Here's the truth:
- You can't afford NOT to have support
- Free resources only get you so far
- The right mentor will pay for themselves 10x over
- Community is often affordable (or free!)

This community IS part of your support system.

But don't stop here. Keep building your village.

Sarah

YOUR TURN: Who's in YOUR support system right now? What's missing?`,
  },
  {
    title: "Self-Care for Coaches (It's Not Optional)",
    content: `Hi! Can we talk about something important?

Self-care.

And no, I don't mean bubble baths and face masks (though those are nice).

I mean the NON-NEGOTIABLE practices that keep you from burning out.

As coaches, we pour into others all day. We hold space for pain, frustration, fear. We carry our clients' struggles with us.

If we don't actively replenish, we deplete.

Here's what self-care for coaches ACTUALLY looks like:

ENERGETIC BOUNDARIES:
- Not carrying client energy home
- Having a ritual between sessions (shower, walk, dance)
- Not scrolling during "off" time

SCHEDULE PROTECTION:
- Days with no clients
- Max sessions per day (I recommend 4-5 max)
- Buffer time between calls

PHYSICAL BASICS:
- Sleep (8 hours is not optional)
- Movement (whatever feels good)
- Nutrition (practice what you preach)

MENTAL WELLNESS:
- Your own therapy/coaching
- Peer supervision or support
- Time for things that have nothing to do with work

SOUL FUEL:
- Creative outlets
- Nature
- Connection with loved ones
- Joy and play

The most successful coaches I know are RUTHLESS about self-care.

Not because they're selfish. Because they know they can't serve from an empty cup.

Sarah

YOUR TURN: What's your non-negotiable self-care practice? Share below!`,
  },
  {
    title: "When to Raise Your Prices",
    content: `Hi there! Let's talk about pricing again - specifically, when to RAISE your prices.

Because here's the thing:
Your first prices were probably too low. (No judgment - we all do this.)

Signs it's time to raise your prices:

1. YOU'RE FULLY BOOKED
If you have a waitlist, you're too cheap.

2. YOU FEEL RESENTFUL
If you dread sessions because you're underpaid, it's time.

3. YOUR RESULTS ARE GETTING BETTER
More skills = more value = higher prices.

4. YOU'VE BEEN COACHING FOR 6+ MONTHS
Experience matters. Price accordingly.

5. YOUR COMPETITORS CHARGE MORE
Check your market. Are you the cheapest? Why?

How to raise your prices:

OPTION 1: Grandfather existing clients
Keep current clients at old rates for a period, new clients at new rates.

OPTION 2: Raise everyone at renewal
Give 30-60 days notice. "My rates are increasing to [X] as of [date]."

OPTION 3: Create a new offer
Package your services differently at the new price point.

What to say:
"My rates are increasing to [X] starting [date]. This reflects the value and results I'm now delivering. I wanted to give you advance notice as a current client."

That's it. No over-explaining. No apologizing.

Will some people leave? Maybe.
Will better clients appear? Absolutely.

Sarah

YOUR TURN: When was the last time you raised your prices? What's holding you back?`,
  },
  {
    title: "Creating Recurring Revenue",
    content: `Hi! Want to know the secret to consistent income in your coaching business?

Recurring revenue.

One-off sessions are fine, but they keep you on the client-hunting hamster wheel.

Recurring revenue means:
- Predictable income every month
- Less hustling for new clients
- Deeper transformations for clients
- More stability for you

Here are ways to create recurring revenue:

1. MEMBERSHIP MODEL
Monthly access to group calls, content, community. $47-197/month.

2. RETAINER COACHING
Ongoing support for past clients. Monthly check-ins. $200-500/month.

3. MAINTENANCE PACKAGES
After intensive programs, offer ongoing support. 1-2 calls/month.

4. GROUP PROGRAMS
Monthly cohorts that run continuously. Always open for enrollment.

5. COURSES + COACHING COMBO
Self-paced course with monthly live support.

The key is to create something clients want to stay in.

Not because they're stuck - because they're growing.

Think about what your clients need AFTER your core program:
- Accountability?
- Ongoing support?
- Community?
- Advanced training?

Build that.

Sarah

YOUR TURN: What could you create that clients would WANT to stay in? Share your ideas!`,
  },
  {
    title: "Price Increase Script",
    content: `FREEBIE FRIDAY

Hi there! Happy Friday! Time for this week's free resource!

Last week: Testimonial Request Scripts
This week: Price Increase Script

Raising your prices is one of the scariest things you'll do as a coach.

But it's also one of the most important.

This freebie includes:

SCRIPT 1: Email to Existing Clients
How to announce a price increase with grace and confidence.

SCRIPT 2: The FAQ Response
What to say when they ask "Why the increase?"

SCRIPT 3: The Grandfather Offer
How to honor current clients while moving to new rates.

SCRIPT 4: The "I Can't Afford It" Response
What to say when they push back on price.

SCRIPT 5: The New Client Conversation
How to confidently state your new prices.

PLUS:
- When to raise (and when to wait)
- How much to increase
- How to handle your own mindset
- What NOT to say

You deserve to be paid well for the work you do.

Sarah

COMMIT: Comment below with the date you're raising your prices by!`,
  },
  {
    title: "Planning Your Next 90 Days",
    content: `Hi there! As we wrap up Week 4, let's think bigger.

What do you want to accomplish in the next 90 days?

Not "eventually." Not "someday." The next 90 days.

90-day planning works because:
- It's long enough to accomplish something real
- It's short enough to stay focused
- It forces prioritization
- It creates urgency

Here's how to plan your next 90 days:

STEP 1: PICK ONE BIG GOAL
Examples:
- Sign 5 clients
- Launch a group program
- Create a course
- Build to $5K months
- Get 10 testimonials

STEP 2: BREAK IT INTO MONTHLY MILESTONES
Month 1: [What needs to happen first?]
Month 2: [What builds on that?]
Month 3: [What completes the goal?]

STEP 3: BREAK MONTHS INTO WEEKS
What specific actions each week?

STEP 4: IDENTIFY YOUR ROADBLOCKS
What might get in the way? Plan for it.

STEP 5: BUILD IN ACCOUNTABILITY
Tell someone. Check in weekly. Track progress.

The coaches who succeed are the ones who plan AND take action.

Dreaming is not a strategy. Planning is.

Sarah

YOUR TURN: What's YOUR one big goal for the next 90 days? Share below and let's support each other!`,
  },
  {
    title: "Month 1 Celebration",
    content: `MONTH 1 CELEBRATION!

Hi coaches!

WE DID IT! One full month of daily tips, wins, growth, and community!

Let's take a moment to reflect:

Over the past 30 days, you've learned:
- You don't need to know everything to start
- Your first client is closer than you think
- Imposter syndrome means you're growing
- Your niche can be simple
- Your story IS your credibility
- You don't need a perfect website
- How to price with confidence
- Discovery call structure
- Pilot program magic
- Following up like a pro
- Testimonial tactics
- Referral strategies
- Boundaries that work
- Self-care that matters
- When to raise your prices
- And SO much more!

But more importantly...

YOU SHOWED UP.

Day after day. Even when it was hard. Even when you were scared.

THAT is what builds a coaching business.

Drop below:
- One thing you're proud of from this month
- One thing you're committing to next month

I'm SO proud of this community.

Here's to Month 2!

With all my love, Sarah

P.S. If these daily tips have helped you, share this community with a friend who's on her coaching journey too!`,
  },
  {
    title: "The Real Secret to Success",
    content: `Hi there! As we close out this month, I want to share the real secret to success as a coach:

Consistency over perfection.

It's not about:
- The perfect website
- The perfect niche
- The perfect program
- The perfect price
- The perfect post

It's about showing up. Again and again.

The coaches who succeed are not the smartest or most talented.
They're the ones who kept going when it got hard.

Here's what I've noticed in this community:

The ones getting clients? They're posting even when it's scary.
The ones building confidence? They're taking calls even when they're nervous.
The ones growing? They're asking for help instead of suffering alone.

You don't have to be perfect. You just have to be persistent.

So wherever you are right now:
- 0 clients? Keep going.
- Feeling stuck? Keep going.
- Made a mistake? Keep going.
- Feeling scared? Keep going.

Every successful coach you admire started exactly where you are.
The only difference? They didn't stop.

I believe in you. I believe in your mission. I believe in your ability to help others heal.

Keep going.

With all my love, Sarah`,
  },
];

// Contextual comments for each coaching tip - unique and realistic
const postSpecificComments: { [key: number]: { comments: string[], sarahReplies: string[] } } = {
  // Post 0: "You Don't Need to Know Everything"
  0: {
    comments: [
      "Oh my gosh, I literally froze on a call last week when a client asked about SIBO and I panicked. Reading this made me feel SO much better about just saying 'let me research that'!",
      "My biggest fear: 'What's the mechanism behind cortisol's effect on thyroid function?' I'm terrified someone will ask me this in depth!",
      "I've been putting off getting clients because I feel like I need to memorize the entire IFM curriculum first. This is such a relief.",
      "The question I'm most afraid of: anything related to medications and interactions. I always want to be careful about scope of practice there.",
      "Thank you for normalizing this! I thought I was the only one who felt like a fraud some days.",
      "Literally crying reading this. I've been so hard on myself for not knowing everything after certification.",
      "Question I'm afraid of: 'Why didn't this protocol work for me when it worked for your other clients?' The individuality of it all is intimidating!",
      "My husband doesn't understand why I'm still studying even after getting certified. This explains it perfectly - we're always learning!",
      "What if they ask me something about lab values I haven't seen before? That's my nightmare scenario.",
      "I saved this to my phone so I can read it before every client call. Nervous but hopeful!",
      "The 'research and get back to you' approach feels so professional actually. Why was I so scared of it?",
      "My fear: clients who've already done tons of research and know more than me about their specific condition.",
      "Reading this during my morning meditation and it hit different. We don't have to be perfect. Just present.",
      "I've been a nurse for 15 years and STILL feel imposter syndrome starting something new. This helped!",
      "The question I dread: 'What makes you qualified to help me?' I know I'm certified but it still triggers something.",
      "Just bookmarked this. Going to read it every time I doubt myself before a call.",
      "This is exactly what I needed after bombed my practice session yesterday. The self-doubt was REAL.",
      "Honestly thought I was the only one who researches for hours after client calls. Glad to know it's normal!",
      "My mom keeps asking when I'll be 'ready' to start. I'm realizing maybe I already am?",
      "What if they ask about a condition I've never even heard of? That's kept me up at night.",
      "The certification gave me knowledge but this community gives me confidence. Both matter equally!",
      "I was literally about to delay starting for another 6 months. This post changed my mind.",
      "My scariest question: 'Can you guarantee results?' How do you answer that with integrity?",
      "Three months into the program and I STILL feel like I don't know enough. This hit home.",
      "Reading this with my morning coffee and actually feeling excited instead of terrified for once!",
      "The most honest post I've read about starting out. Thank you for being real with us Sarah.",
      "My fear is complex chronic illness cases where everything is interconnected. Where do you even start?",
      "Just sent this to my cohort group chat. We all needed to read this today.",
      "I realized I've been using 'needing more education' as an excuse to avoid putting myself out there.",
      "This gave me permission to be human. Coaches are learners too. Simple but powerful.",
      "My anxiety was through the roof about launching. After reading this I feel like I can breathe.",
      "What about when clients have already tried everything and you're their 'last hope'? That pressure is real.",
      "Printed this out and stuck it on my vision board. Going to read it daily until I believe it!",
      "The part about 'willing to learn' vs 'knowing everything' completely reframed how I see my role.",
      "Just realized I've been comparing myself to coaches with 20 years experience. Of course I feel inadequate!"
    ],
    sarahReplies: [
      "Your honesty here takes courage! That 'I don't know, let me research' response actually builds MORE trust with clients. Keep going!",
      "Scope of practice awareness shows you're thinking like a true professional. That's exactly right - when in doubt, refer out or research!",
      "The fact that you're thinking this deeply about client care tells me you're going to be an AMAZING coach. Trust the process!",
      "This awareness is actually a STRENGTH. Coaches who think they know everything are the dangerous ones!",
      "I still research after calls sometimes - it never stops! That curiosity is what makes us good at this work.",
      "Your dedication to learning is exactly what your future clients need. They'll feel that care!",
      "Complex cases get easier with experience. Start with the basics and your confidence will grow naturally!",
      "That fear of judgment often comes from our own inner critic. Your clients will see your heart, not your perfection.",
      "Permission granted to be imperfect! The best coaches I know are the most humble ones.",
      "This self-awareness will serve you so well. Clients can sense authenticity a mile away!"
    ]
  },
  // Post 1: "Your First Client Is Closer Than You Think"
  1: {
    comments: [
      "My neighbor literally asked me last week if I could help her with her digestion issues. I panicked and changed the subject!",
      "Okay, making my list now: my best friend (thyroid), my aunt (inflammation), my coworker (fatigue), my yoga teacher (gut). OMG they're everywhere!",
      "I've been so focused on building a funnel that I forgot about the people already in my life who need help!",
      "My sister has been my unofficial guinea pig for years. Maybe it's time to formalize things...",
      "This reframe from 'marketing' to 'conversations' just made this feel SO much more doable.",
      "Anyone else realize they've been giving free health advice to friends for years? Time to make it official!",
      "My ideal first client: she's exhausted, dismissed by doctors, doing 'all the right things' but still feels terrible. Basically ME two years ago.",
      "I keep waiting for the 'right' client to magically appear. Maybe I should just TALK to people?",
      "Just made a list of 7 people who've asked me for health advice in the last month. Wow.",
      "My mom's friend literally said 'I wish I knew someone who could help me figure out why I'm so tired.' HELLO!",
      "The thought of reaching out to people I know feels scarier than reaching out to strangers somehow?",
      "My ideal client: mid-40s, perimenopausal, exhausted, can't lose weight despite trying everything. That's like half my friend group!",
      "I think I've been hiding behind 'building my business' to avoid actually talking to people.",
      "Made my list: my college roommate, my neighbor, two moms from my kids' school, my hairdresser. Wow they're really everywhere!",
      "The 'perfect approach' paralysis is SO real. I've been planning for 3 months without one real conversation.",
      "My sister keeps hinting that she needs help. I keep saying 'when I'm ready.' Maybe I'm ready now?",
      "I've been helping my coworker with her meal prep for free. Maybe it's time for a real conversation.",
      "Ideal first client: stressed professional mom who puts everyone else first and has completely lost herself. I know about 20 of them!",
      "Someone in my book club JUST said she wished she could find a health coach. I literally said nothing. Why?!",
      "This made me realize I've been waiting for permission that was never going to come. Permission granted to myself!",
      "My fear is mixing friendship and business. What if it gets awkward?",
      "Ideal first client: someone who's done all the labs, has a folder of results, but no one will connect the dots for her.",
      "I literally have a Google doc of health protocols I've created for friends over the years. Maybe I should... charge?",
      "The 'one conversation' approach takes all the pressure off. I can do ONE conversation.",
      "My trainer at the gym keeps asking me nutrition questions. She'd probably be a great first client actually!",
      "I've been so focused on Instagram that I forgot about real life relationships. This was a wake up call.",
      "Made my list and now I feel excited instead of scared. Progress!",
      "My ideal client keeps me up at night because she's basically me from 5 years ago. I know exactly what she needs.",
      "The barista at my coffee shop has PCOS and we've talked about it. Could that be a potential client?",
      "Just realized I've been looking for clients in all the wrong places. They're literally in my phone contacts!"
    ],
    sarahReplies: [
      "Your neighbor sounds PERFECT! What if you just said 'Hey, I actually help people with that now - want to grab coffee and talk about it?'",
      "That list is GOLD! Don't reach out yet - just notice them. Awareness is the first step!",
      "Mixing business and friendship CAN feel awkward at first, but it often deepens the relationship when done with integrity!",
      "That fear of the first conversation is so normal! It gets easier with every single one you have.",
      "Your lived experience IS your expertise. The people who know your story already trust you!",
      "One conversation at a time! You don't need a funnel to help one person.",
      "That Google doc of protocols you mentioned? That's actually a business already. Now you just get paid for it!",
      "The people in your life have been watching your transformation. They already believe in you!",
      "Perfect doesn't exist! Good enough plus genuine care beats perfect every time."
    ]
  },
  // Post 2: "Imposter Syndrome Is a Sign You're Growing"
  2: {
    comments: [
      "My imposter syndrome today: definitely a solid 8/10. Thanks for normalizing this!",
      "9/10 this morning, honestly. I woke up at 3am wondering if I should refund my entire certification.",
      "6/10 today - better than yesterday's 10! Reading posts like this helps.",
      "7/10 but I'm pushing through anyway. Fake it til you make it, right?",
      "Currently at a 10 because I have my first practice call scheduled for tomorrow!",
      "I needed to hear that caring deeply is a GOOD thing. I've been beating myself up for being 'too anxious.'",
      "5/10 today - starting to believe I might actually be able to do this!",
      "The reframe from 'I'm not good enough' to 'I care about doing this right' just shifted something in me.",
      "8/10 - every time I see another coach's Instagram I spiral. Working on staying in my lane.",
      "3/10 today which feels like PROGRESS! A month ago I was stuck at 9 constantly.",
      "Anyone else's imposter syndrome get triggered by seeing classmates sign clients before them?",
      "10/10 this morning. Literally almost deleted my business Instagram before reading this.",
      "The part about humble coaches being the best coaches made me feel so much better about my doubts.",
      "4/10 - I actually believe today might be a good day! This community helps so much.",
      "Definitely an 8. I keep comparing myself to Sarah (sorry Sarah!) and feeling like I'll never measure up.",
      "7/10 but I scheduled a discovery call anyway. Taking action despite the fear!",
      "My imposter syndrome is highest when I'm about to put myself out there. Which is basically always.",
      "6/10 - much better since I stopped doom-scrolling other coaches' success stories!",
      "The line 'taking action DESPITE the fear' is going on my wall. Game changer mindset.",
      "9/10 today. My client said something was working and my brain immediately went to 'it's a fluke.'",
      "Anyone else's imposter syndrome specifically spike around Instagram? I need to take a break from comparing.",
      "5/10 today! Posted my first reel yesterday and the world didn't end!",
      "8/10 - I keep thinking everyone else in this program 'gets it' and I'm just pretending.",
      "The fact that every graduate felt this way is SO reassuring. We're all in this together!",
      "7/10 but reading these comments makes me feel less alone. Thanks for creating this space Sarah.",
      "Solid 9 after looking at my bank account. Hard to feel confident when you have zero clients.",
      "4/10 today because I finally told someone I'm a health coach and they seemed interested!",
      "My imposter syndrome goes to 10 whenever anyone asks about my credentials. Working on owning it!",
      "6/10 - better than usual because I prepped really well for my practice call tomorrow.",
      "The compassion point hit hard. I need to extend to myself the same grace I extend to clients."
    ],
    sarahReplies: [
      "That 3am worry is SO real! And the fact that you're pushing through anyway? That's exactly what builds real confidence!",
      "8/10 to 3/10 in a month is INCREDIBLE progress! You're building that muscle!",
      "The comparison spiral is real. Remember: their success isn't your failure. There are enough clients for everyone!",
      "Taking action despite the fear is EVERYTHING. The confidence comes AFTER the action, not before!",
      "You're not pretending - you're learning. There's a huge difference!",
      "Scheduling that call at a 10 imposter syndrome level? That's BRAVE. I'm so proud of you!",
      "Your doubts show you care. Channel that care into your clients and watch what happens!",
      "The fact that you're here, showing up, reading this - that already sets you apart!",
      "Every successful coach started exactly where you are. Including me!"
    ]
  },
  // Post 3: "Stop Waiting for the Perfect Niche"
  3: {
    comments: [
      "I help women with chronic fatigue and brain fog so they can stop feeling like they're going crazy and start trusting their bodies again!",
      "Okay attempting this: I help new moms with hormone imbalances so they can feel like themselves again instead of exhausted strangers.",
      "I help women over 40 with unexplained weight gain so they can stop fighting their bodies and start working WITH them!",
      "This is so hard but here goes: I help anxious high-achievers with gut issues so they can finally feel comfortable in their own bodies.",
      "I help perimenopausal women with sleep issues so they can wake up actually rested for once!",
      "Been overthinking this for MONTHS. Let me try: I help stressed entrepreneurs with digestive issues so they can focus on their business instead of their stomach.",
      "I help women with autoimmune conditions so they can feel in control of their health instead of helpless.",
      "My attempt: I help busy moms with hormone chaos so they can show up as the mom they want to be.",
      "Starting with MY story is so simple but I never thought of it that way. I help women with hashimoto's because I AM her!",
      "I help teachers with burnout and adrenal fatigue so they can love their job again (because that was literally me!).",
      "Here's mine: I help women with PCOS so they can stop feeling broken and start feeling empowered!",
      "I spent $500 on a 'find your niche' course when the answer was my own health journey all along!",
      "I help corporate women with stress-related gut issues so they can succeed at work without sacrificing their health.",
      "My messy attempt: I help exhausted nurses with hormone imbalances so they can care for others without depleting themselves.",
      "I help women with mystery symptoms so they can get answers when doctors won't listen!",
      "Trying this: I help women with thyroid issues so they can stop being told 'your labs are normal' when they feel anything but.",
      "I help new coaches with imposter syndrome so they can start serving clients without the fear (can that be a niche?!).",
      "I help women with migraines so they can live life without planning around their next headache.",
      "My story: I help postpartum women with depression and anxiety so they can enjoy being a mom instead of just surviving.",
      "I help women with histamine intolerance so they can eat without fear and live without restrictions!",
      "Starting simple: I help women with bloating so they can stop avoiding photos and start living confidently.",
      "I help women with endometriosis so they can manage their pain and reclaim their lives!",
      "Here's my first draft: I help women with food sensitivities so they can eat socially again without anxiety.",
      "I help menopausal women with brain fog so they can feel sharp and confident at work again!",
      "I help women who've been gaslit by doctors so they can trust their bodies and find real answers.",
      "My niche is literally my healing journey: helping women with eczema so they can feel comfortable in their skin!",
      "I help women with chronic inflammation so they can stop living in survival mode and start thriving!",
      "Trying this: I help moms with autoimmune flares so they can be present for their kids instead of in bed.",
      "I help women athletes with hormone imbalances so they can perform without period problems!",
      "I help women with IBS so they can travel and eat out without anxiety. That was my life for years!"
    ],
    sarahReplies: [
      "YES! That's so clear and powerful! The women who need you will immediately see themselves in this!",
      "I love that you're leading with transformation, not just the problem. That's exactly right!",
      "The 'gaslit by doctors' angle is SO powerful because it's unfortunately SO common. You'll attract so many women who need that validation!",
      "Starting with your story is the answer because it's authentic. No one can compete with your lived experience!",
      "This is perfect! Simple, clear, and speaks directly to someone's pain. They'll feel seen!",
      "The fact that you ARE her gives you instant credibility. Clients want someone who truly gets it!",
      "Love how specific this is! 'Nurses with hormone imbalances' immediately narrows your audience in the best way!",
      "This will evolve as you work with clients - you're not locked in! Give yourself permission to refine it!",
      "The transformation you promise is everything. Focus on where they want to GO, not just where they are!"
    ]
  },
  // Post 4: "Your Transformation Story IS Your Credibility"
  4: {
    comments: [
      "After years of chronic fatigue and being told I was 'just stressed', I finally found the root cause. Now I help other exhausted women get real answers.",
      "Here's mine: I gained 40 pounds in a year while eating clean and exercising daily. Doctors said 'eat less.' Turns out it was my thyroid all along.",
      "I spent 15 years on antidepressants before I learned about the gut-brain connection. That's why I'm here now.",
      "My transformation: From barely getting through the workday to running half marathons. All through healing my gut.",
      "One sentence: I healed my Hashimoto's naturally after being told I'd be on medication for life.",
      "I went from 10 different specialists with no answers to vibrant health in 18 months through functional medicine.",
      "After my second baby, I completely lost myself. Healing my hormones gave me my life back. That's my mission now.",
      "My story: chronic migraines for 20 years, gone in 6 months once I addressed the root cause.",
      "I was told my eczema was 'just genetic.' Turns out it was inflammation I could actually control!",
      "From panic attacks on the daily to calm and regulated. Nobody told me it could be related to my blood sugar!",
      "My transformation started when a functional doctor finally listened. I want to be that person for other women.",
      "I reversed my pre-diabetes in 3 months through lifestyle changes. Doctors were shocked. Now I help others do the same.",
      "One powerful sentence: I almost lost my career to brain fog before I discovered it was mold toxicity.",
      "After my diagnosis, I was given a list of foods I could 'never eat again.' Found my own way and now help others find theirs.",
      "I spent $30K on fertility treatments before addressing my underlying PCOS. Now pregnant naturally. That's my story.",
      "From barely surviving each day to actually thriving and enjoying life - all through addressing root causes!",
      "My transformation: IBS for 15 years, completely resolved in 4 months. My doctor couldn't believe my latest tests.",
      "I was the friend everyone came to for health advice because they saw me transform. Maybe it's time to make it official.",
      "After my autoimmune diagnosis, I felt hopeless. Now I've been symptom-free for 2 years. That's the transformation I want to give others.",
      "My story: hypothyroid, adrenal fatigue, gut issues - all connected. Healing one helped heal them all.",
      "I went from crying in the bathroom at work to leading meetings with confidence. Hormones were everything.",
      "My powerful sentence: I refused to accept 'this is just perimenopause' and found real answers.",
      "Three years of infertility ended when I addressed my underlying inflammation. That baby is now 2!",
      "My transformation is ongoing but I went from 15 supplements to 3 and feeling better than ever.",
      "I was written off as a 'difficult patient' for asking too many questions. Turns out my questions saved my life.",
      "After losing my hair to stress, I rebuilt everything. Now I help women before they hit that breaking point.",
      "My story: dismissed by 7 doctors, finally heard by 1, and that changed everything.",
      "I help women who were told 'your labs are normal' because I WAS that woman for a decade!",
      "My transformation started in my kitchen and ended with a completely new life. Food really is medicine.",
      "From chronic pain that stole my 30s to pain-free in my 40s. This is possible for everyone!"
    ],
    sarahReplies: [
      "THIS is what I'm talking about! Someone reading this will think 'that's EXACTLY me!' - that's your future client!",
      "The specificity here is perfect. '15 years on antidepressants' - someone reading this is nodding right now!",
      "Your journey from dismissed to heard is SO powerful. Many women need someone who truly gets that frustration!",
      "That transformation from survival to thriving - that's what people are desperate for. Share this everywhere!",
      "The fact that doctors were shocked says everything. You're living proof that transformation is possible!",
      "'Refused to accept' shows your fighter spirit - that's exactly what draws clients who are ready to fight for themselves!",
      "Your story shows that YOU were once where they are now. That's the most powerful connection!",
      "This kind of vulnerability builds instant trust. Keep sharing, keep being real!",
      "From 7 doctors to finding your answer - this is the hero's journey people need to see!"
    ]
  },
  // Post 5: "You Can Start Coaching BEFORE Your Website Is Perfect"
  5: {
    comments: [
      "This week I'm having 3 conversations instead of building landing pages. Scary but doing it!",
      "I've redesigned my logo 4 times and haven't talked to a single potential client. This is the wake-up call I needed.",
      "Okay, I'm posting this publicly for accountability: I'm reaching out to one person THIS WEEK. No more hiding behind 'the website.'",
      "I literally spent last weekend on Canva making graphics instead of actually connecting with anyone. Oops.",
      "My action this week: messaging my friend who's been struggling with fatigue. Actual conversation > perfect Instagram.",
      "Just realized I've been using the website as a safety blanket to avoid rejection. Harsh but true.",
      "This week I'm setting up Calendly and telling ONE person I'm available for coaching. That's it. Baby steps.",
      "I have a 20-page brand guide and zero clients. Maybe I have my priorities backwards!",
      "My action: I'm going to respond to the next person who asks me for health advice with 'actually, I help people with that now!'",
      "Scheduled my first free consult call for Thursday. No website. Just Zoom and determination!",
      "I've spent more on Squarespace than I've made as a coach. Let that sink in. Time to change that!",
      "This week: actually talking to humans instead of arguing with my About page for the 100th time.",
      "Just deleted my 'website to-do list' from my task manager. Focusing on PEOPLE this week!",
      "My action step: reaching out to my former CrossFit buddy who mentioned hormone issues. No more excuses!",
      "I've been perfectioning my 'brand voice' for 3 months. Meanwhile I haven't used my actual voice to help anyone.",
      "This week I'm signing up for Calendly and sending my first 'Hey, can we chat about coaching?' message.",
      "Guilty of the Canva rabbit hole! This week I'm closing Canva and opening my text messages.",
      "My homework this week: practice telling people I'm a health coach without immediately apologizing.",
      "Just realized I've been treating my website like it's the Mona Lisa. It's a website. It can be ugly and I can still help people!",
      "Action item: I'm going to the networking event on Thursday and actually telling people what I do. Terrifying but necessary!",
      "I've watched 47 YouTube videos on website building. Zero on how to have sales conversations. Priorities, right?",
      "This week I'm practicing my elevator pitch in the mirror until it feels natural. Websites can wait!",
      "Just set up a simple Calendly link. It took 10 minutes. Why did I think I needed more than this?",
      "My action: posting on my personal Instagram that I'm now taking clients. No website required!",
      "I've been hiding behind 'building infrastructure' when really I'm just scared of putting myself out there.",
      "This week: coffee date with my friend who wants help with her energy. First real coaching convo!",
      "Accountability post: I scheduled 2 discovery calls this week. Both from just reaching out to people I know!",
      "Just realized I already have everything I need to help someone. Now I just need to... help someone!",
      "My action this week: updating my LinkedIn to say 'Health Coach' and not feeling weird about it!",
      "I've been treating my website like it needs to be done before I can breathe. Taking a deep breath and DMing someone instead!"
    ],
    sarahReplies: [
      "YES! Reaching out to that ONE person this week will teach you more than 3 months of building websites!",
      "Love this accountability post! You just declared it publicly - now you HAVE to do it! We're all cheering you on!",
      "The website perfectionism is SO common! I'm glad you're breaking through it. Conversations > Canva!",
      "That Calendly + determination combo is literally all you need. You've got this!",
      "The 'actually I help people with that now' response is PERFECT. Try it and tell us how it goes!",
      "Deleting the website to-do list is BOLD and I love it! Focus on humans!",
      "Practice talking to real people always beats practicing on your About page. You're making the right choice!",
      "That networking event is going to change everything. Show up, be yourself, share your story!",
      "10 minutes for Calendly vs months on a website - you just proved my point perfectly!"
    ]
  },
  // Post 6: "Weekly Wins Thread"
  6: {
    comments: [
      "WIN: I finally finished Module 3! It took me 3 weeks but I did it!",
      "Told my hairdresser I'm a health coach and she seemed interested! Baby step but counts!",
      "I posted my transformation story on Instagram for the first time. Only got 12 likes but I DID IT.",
      "Had my first ever practice call with a classmate. Terrifying but I survived!",
      "WIN: I reached out to a friend about coaching and she wants to schedule a call next week!",
      "Small win: I updated my email signature to include 'Integrative Health Coach.' Feels official!",
      "I created my niche statement even though it's not perfect. Progress over perfection!",
      "Set up my Calendly finally! Only took 5 minutes. Don't know why I was avoiding it!",
      "My win: I told my mom I'm going to be a health coach and she was actually supportive!",
      "Completed the pricing module and actually wrote down numbers. Scary but empowering!",
      "I showed up here every single day this week even when I didn't feel like it. Consistency win!",
      "WIN: My friend asked me to help her with her diet and I said yes instead of deflecting!",
      "Finally downloaded Friday's freebie and actually read it! Applying it tomorrow!",
      "I practiced my discovery call script in the mirror without laughing at myself. Growth!",
      "My win: I didn't compare myself to other coaches on Instagram today. Staying in my lane!",
      "Sent a scary email to a potential collaboration partner. No response yet but I DID IT!",
      "WIN: I filled in my niche statement 'I help ___' and it actually makes sense!",
      "My husband finally understands what I'm doing! That conversation felt like a win.",
      "I made a list of 10 potential first clients. That list was zero last week!",
      "Scheduled my very first real discovery call for next Tuesday. Freaking out but excited!",
      "Small win: I stopped saying 'I'm thinking about becoming a health coach' and started saying 'I AM a health coach.'",
      "Completed my intake form draft. It's probably not perfect but it exists!",
      "WIN: Posted in this community for the first time. That counts, right?",
      "I practiced saying my prices out loud. It felt weird but I didn't choke!",
      "My biggest win: I made progress instead of making excuses this week!",
      "Finally organized all my notes from the modules into a system I can actually use!",
      "WIN: I listened to a podcast interview and thought 'I could do this someday!'",
      "Made it through the week without spiraling into imposter syndrome (mostly). HUGE!",
      "My win: I blocked time on my calendar for 'coaching business work.' It's real now!",
      "Reached out to 3 people about potentially coaching them. No responses yet but 3 more than last week!"
    ],
    sarahReplies: [
      "Every single one of these wins is MOVING YOU FORWARD! I'm so proud of this community!",
      "That first discovery call scheduled? HUGE! You're going to crush it!",
      "Telling people you ARE a coach instead of 'thinking about it' - that shift in identity is EVERYTHING!",
      "The Instagram post about your story? That took courage. The likes don't matter - the action does!",
      "Showing up every day IS the win! Consistency beats perfection every time!",
      "That pricing practice? Keep doing it! The more you say it, the more natural it becomes!",
      "Love seeing the progress from 'thinking about it' to 'doing it' - you're all inspiring!",
      "These 'small' wins add up to MASSIVE transformation. Keep celebrating every step!",
      "The fact that you're posting wins means you're looking for them - that mindset shift is huge!"
    ]
  },
  // Post 7: "How to Price Your Services Without Undervaluing Yourself"
  7: {
    comments: [
      "I was planning to charge $30/hour. After reading this, I'm rethinking everything.",
      "My current rate: $0 because I haven't started. But I'm planning on $125/session once I do!",
      "I'm so scared to charge $150. What if they say no?? But I get the point about commitment.",
      "The comparison to meal delivery services and facials really hit home. This IS valuable work!",
      "Planning to charge $175/session but my hands are sweating just typing that.",
      "I charged $50 for a practice session and my client cancelled. Maybe there's something to this!",
      "Currently at $75/hour because I'm 'new.' After reading this, I'm raising it to $150 next month!",
      "The point about undercharging hurting clients is something I never considered. Mind blown.",
      "I'm planning $200/session or $1500 for an 8-week package. Does that seem reasonable?",
      "Just did the math: my supplements alone cost more per month than one coaching session would. Perspective!",
      "I'm so uncomfortable talking about money but this post made me realize I need to get over it!",
      "Planning to start with $100/session for my pilot clients. Is that still too low?",
      "The transformation framing is everything. I'm not selling an hour, I'm selling their life back!",
      "Currently charging nothing because I'm 'practicing.' But at what point does practice become work?",
      "I compared my planned rate to what my chiropractor charges. I need to value myself more!",
      "Planning $175/session with a 6-session package for $900. Working up the courage to actually charge this!",
      "The point about clients not showing up when it's cheap - I've experienced this personally on the other side!",
      "I've been giving away so much for free. This post made me realize that's not serving anyone.",
      "Planned rate: $150/session but I always imagine people laughing at me when I say it out loud.",
      "Reading everyone's numbers here is normalizing this for me. We all have these fears!",
      "I spent $200 on a face cream last week. Why am I scared to charge $200 to help someone transform their health?",
      "Planning on $125/session to start, then raising to $175 after my first 5 clients. Baby steps!",
      "The pilot program discount idea is genius. Takes some pressure off that first price!",
      "Currently: too scared to name a number. After this: $150/session. There, I said it!",
      "I've been undervaluing myself in every area of life. Time to change that starting with coaching!",
      "The '8-12 week packages' suggestion is helpful. One session feels harder to price for some reason.",
      "My husband spent $600 on golf clubs last month but thinks I'm crazy to charge $150. Men don't get it!",
      "Planning $1800 for a 12-week program. Is that too high? Too low? I genuinely have no idea!",
      "Just realized I've never had a healthy relationship with money. This work is deeper than coaching!",
      "I'm going to practice saying '$150 for a session' until it doesn't make me want to hide. Starting today!"
    ],
    sarahReplies: [
      "Your services ARE worth $150+! Practice saying it until it feels natural - that's exactly right!",
      "$175/session is TOTALLY reasonable! People pay that for massages that last an hour. Your work lasts a lifetime!",
      "The pilot program approach is perfect for building confidence. Start there, then raise!",
      "You're not selling time - you're selling transformation. Keep repeating that until you believe it!",
      "The money discomfort is SO common among new coaches. You're not alone in this!",
      "$30/hour would have you burning out and resentful in months. So glad you're reconsidering!",
      "When clients invest real money, they show up differently. You're actually serving them by charging well!",
      "That $1800 for 12 weeks is absolutely reasonable! That's only $150/week for life-changing work!",
      "Your worth isn't determined by your newness. Your training and care are already valuable!"
    ]
  },
  // Post 8: "What to Say on Your First Discovery Call"
  8: {
    comments: [
      "My biggest fear: awkward silence after they're done talking. What if I have nothing to say??",
      "I'm scared I'll forget everything the moment the call starts. Printing this structure out!",
      "My fear: coming across as salesy. I hate feeling like I'm 'selling' something.",
      "What if they ask about my credentials and I blank? That's my nightmare scenario!",
      "I'm terrified of the money conversation. How do you bring it up naturally?",
      "My biggest call fear: crying. I get emotional when people share their struggles!",
      "The 'then STOP TALKING' advice about pricing is SO hard. I always want to fill the silence!",
      "Fear: what if I can't actually help them? What if their issues are beyond my scope?",
      "I'm worried I'll talk too much and not listen enough. It's a nervous habit!",
      "The structure is helpful but what if they don't follow it? What if they go off-topic?",
      "My fear: accidentally promising something I can't deliver in the moment.",
      "What if they already know more than me about their condition? That terrifies me!",
      "I'm scared they'll ask for a discount and I won't know what to say.",
      "The 'discovering if you're a fit' reframe just took SO much pressure off. Thank you!",
      "My biggest fear is looking young/inexperienced on video. Worried they won't take me seriously.",
      "What do you do if you realize mid-call that you CAN'T help them? How do you end gracefully?",
      "I'm worried about my tech failing during the call. Already had a Zoom panic attack this week!",
      "Fear: what if I freeze when they ask 'so how does this work exactly?'",
      "The 5-15-5-10-5 structure is perfect. I need this much detail for my anxious brain!",
      "My biggest worry: seeming like I need their business too much. Is desperation visible??",
      "What if they compare me to their last coach who was supposedly terrible? Pressure!",
      "I'm scared of not being able to answer 'why should I work with YOU specifically?'",
      "Fear: getting defensive if they push back on my approach. I take things personally!",
      "The part about connecting dots between symptoms and root causes - that's where I freeze!",
      "My fear is that I'll be SO nervous they'll lose confidence in me before I even start!",
      "What if they can tell I've only had this certification for 3 months??",
      "I'm worried about pacing. What if we're only 20 minutes in and I've covered everything?",
      "Fear: what if they ask for references and I don't have any yet?",
      "The 'you're not convincing' reframe is everything. Taking the pressure off sales helps so much!",
      "My biggest fear: them saying no at the end after I've put all that effort in. How do you handle that?"
    ],
    sarahReplies: [
      "That fear of silence is SO normal! But silence shows you're listening, not that you're failing!",
      "If they go off-topic, gently guide them back: 'That's so interesting - can we come back to X because I want to make sure I understand your main challenge?'",
      "Crying shows empathy! I've gotten teary on calls before. Clients appreciate the humanity!",
      "If someone asks for references and you're new: 'I'm building my practice and would love you to be one of my early success stories!'",
      "The money silence is SO powerful. Let them process. The first one to speak usually loses!",
      "'No' is just information! It means they're not ready, not that you failed. Every no gets you closer to a yes!",
      "Tech fails are human! Laugh it off and it shows you're relatable, not unprofessional!",
      "Your age/appearance doesn't determine your competence. Lead with your story and expertise!",
      "If you realize you can't help: 'Based on what you've shared, I think you'd be better served by [specialist]. Can I help you find one?'"
    ]
  },
  // Post 9: "The Power of Pilot Programs"
  9: {
    comments: [
      "I'M IN! I help exhausted moms with hormone imbalances. Launching my pilot program next week!",
      "This takes SO much pressure off. I'm not saying I'm perfect, I'm saying I'm learning. Love it!",
      "I'M IN! Chronic fatigue is my niche. Setting up my pilot offer tonight!",
      "The testimonial exchange is genius. I get experience AND social proof? Win-win!",
      "I'M IN! I focus on gut health. Going to reach out to 3 potential pilots this week!",
      "How many pilot clients is too many? I don't want to overwhelm myself at the start.",
      "I'M IN! My niche is perimenopausal women. Creating my pilot structure now!",
      "The 'refining your approach' framing makes this feel so much safer than 'full-price paying client.'",
      "I'M IN! I help women with PCOS. Already have someone in mind for my first pilot!",
      "What if pilot clients want to continue after the 4 weeks? Do I keep them at the discounted rate?",
      "I'M IN! Autoimmune is my jam. Going to draft my pilot program email tonight!",
      "The honesty about 'refining your process' feels so authentic. Clients appreciate that!",
      "I'M IN! I help anxious professionals with stress-related health issues. Pilot program, here I come!",
      "50% off my eventual rate = I can actually name a number without panicking. Thank you!",
      "I'M IN! Women over 40 with unexplained symptoms. Finally have a plan to move forward!",
      "Does the 4-week structure work for everyone or should some conditions be longer?",
      "I'M IN! Helping women with thyroid issues. The pilot format finally makes this feel real!",
      "The feedback requirement is actually something I WANT. I need to know what's working!",
      "I'M IN! Gut-brain connection is my passion. Creating my pilot offer during lunch today!",
      "What do you do if a pilot client doesn't want to give a testimonial at the end?",
      "I'M IN! I focus on inflammation. Love the testimonial library concept!",
      "The 'before/after metrics' part is something I hadn't thought of. Smart!",
      "I'M IN! Weight loss resistance for women over 35. Feeling motivated for the first time in weeks!",
      "Should I make pilot clients sign something formal or keep it casual?",
      "I'M IN! Stress and burnout. Finally have a clear path to my first paying clients!",
      "The 'active participation in refining' expectation sets the right tone from the start.",
      "I'M IN! Helping nurses with adrenal fatigue. Know exactly who my first pilot will be!",
      "What tracking tools do you recommend for before/after metrics?",
      "I'M IN! My niche is postpartum hormone issues. The pilot structure makes this possible!",
      "The email support between sessions - how do I set boundaries around that without being unavailable?"
    ],
    sarahReplies: [
      "Love seeing all these I'M INs! You're all taking action and that's what matters!",
      "3-5 pilot clients is the sweet spot! Enough to learn, not so many you're overwhelmed!",
      "If they want to continue after the pilot, move them to your regular rate. You've earned it!",
      "The testimonial is part of the deal - make that clear upfront. Most clients are happy to help!",
      "4 weeks works great for most things, but you can adjust! Some issues need 6-8 weeks. Trust your gut!",
      "For tracking, simple is best at first! Before/after questionnaires, photos if relevant, maybe one key metric!",
      "Email support boundaries: set response time expectations (24-48 hours business days) from day one!",
      "A simple agreement email confirming the arrangement works! Doesn't need to be a formal contract!",
      "Seeing your niches listed out like this - there's room for ALL of you! Different clients need different coaches!"
    ]
  }
};

// Generic contextual comments for posts 10-29
const genericCommentsByType = {
  weekly_wins: [
    "Had my second discovery call this week! Getting more comfortable each time!",
    "Finally figured out my scheduling system. Small win but feels huge!",
    "Got positive feedback from a practice client. Made my whole week!",
    "Showed up every day in this community. Consistency is my win!",
    "Practiced my pitch at a networking event and it felt natural!",
    "Received my first real testimonial and cried happy tears!",
    "Signed my first paying client! Still can't believe it!",
    "Had a breakthrough conversation with someone who needed help!",
    "Finally feel confident saying I'm a health coach out loud!",
    "My pilot client got results and wants to continue!",
    "Overcame my fear of going live on Instagram this week!",
    "Completed another module and feel more confident than ever!",
    "Had a call go SO well that I forgot to be nervous!",
    "Someone reached out to ME asking about coaching!",
    "Raised my prices and no one complained!",
    "Set better boundaries and felt SO much better!",
    "Got a referral from an existing client!",
    "Finally finished my intake form and it looks professional!",
    "Posted consistently for 7 days straight!",
    "Had my first six-figure month... in my dreams but manifesting it!"
  ],
  tips_reflections: [
    "This is exactly what I needed to hear today. Taking notes!",
    "Implemented this yesterday and already feeling the shift!",
    "Printing this out for my coaching workspace!",
    "The timing of this post is unreal - I was JUST struggling with this!",
    "Love how practical these tips are. Actually usable!",
    "Taking this advice into my call tomorrow. Thank you!",
    "This reframe is everything. Mind officially blown!",
    "Adding this to my morning routine immediately!",
    "Already shared this with my accountability partner!",
    "This is the content that keeps me coming back to this community!",
    "Never thought about it this way before. Game changer!",
    "Bookmarked! Going to reference this constantly!",
    "The actionable advice here is so refreshing!",
    "This addressed exactly what I was worried about. Thank you Sarah!",
    "Love how you break complex things down into simple steps!",
    "My coaching notebook is filling up thanks to these posts!",
    "This is the guidance I was looking for!",
    "Implementing immediately. No more procrastinating!",
    "The specific examples help so much. Not just theory!",
    "Sarah always knows exactly what we need to hear!"
  ],
  freebie_friday: [
    "Downloaded! Can't wait to implement this!",
    "These freebies alone are worth the entire program!",
    "Just customized the template with my info. So professional!",
    "This saves me SO much time!",
    "Already sent my first email using this template!",
    "THANK YOU! I was going to spend hours creating this myself!",
    "The scripts are perfect - just needed to add my name!",
    "Love Freebie Fridays! My favorite day of the week!",
    "Printed and added to my coaching binder!",
    "This template is exactly what I needed!",
    "Just forwarded this to my accountability buddy!",
    "The bonuses included are so thoughtful!",
    "Finally feel prepared for this situation now!",
    "Saved to my Google Drive immediately!",
    "These templates make me look SO professional!",
    "The copy-paste format is perfect for someone who hates writing!",
    "Already seeing results from last week's freebie!",
    "Between the tips and freebies, this program is gold!",
    "Just what I needed to take the next step!",
    "Can't believe this is free! Would pay good money for these!"
  ]
};

// Sarah's contextual replies
const sarahGenericReplies = [
  "Your progress is inspiring others whether you realize it or not! Keep going!",
  "Seeing your growth from week to week is exactly why I do this work!",
  "That breakthrough moment is just the beginning. There's so much more coming!",
  "Your dedication to showing up is what separates you from those who don't make it!",
  "Love watching you step into your coaching identity! You're doing amazing!",
  "Every small win adds up to massive transformation. Keep celebrating!",
  "Your commitment to learning and growing is exactly what your clients need!",
  "So proud of how far you've come! Remember where you started!",
  "Keep that momentum going! You're building something beautiful!",
  "Your journey is proof that anyone can do this with the right support!"
];

// Reply templates from other students with more variety
const studentReplyTemplates = [
  "This gives me hope! Thank you for sharing!",
  "Your journey is so inspiring!",
  "Same boat here! Let's keep each other accountable!",
  "Screenshotted this for motivation!",
  "You're doing amazing! Keep going!",
  "This is exactly what I needed to read!",
  "So proud of you for sharing this!",
  "Your vulnerability here is beautiful!",
  "Can't wait to see where you are next month!",
  "We're all cheering you on!",
  "This made my day! Thank you!",
  "Your progress is motivating me!",
  "Love seeing wins like this!",
  "You've got this! We all believe in you!",
  "Following your journey! Keep updating us!",
  "This community is the best!",
  "Your honesty is refreshing!",
  "So relatable! Thank you for being real!",
  "Sending you all the good vibes!",
  "This is why I love this space!"
];

async function main() {
  console.log('Starting community seed...');

  // Clean up existing community data
  console.log('Cleaning up existing community data...');
  await prisma.postLike.deleteMany({});
  await prisma.postComment.deleteMany({});
  await prisma.communityPost.deleteMany({});
  console.log('Cleanup complete');

  // Find Sarah (admin/coach)
  let sarah = await prisma.user.findFirst({
    where: {
      OR: [
        { email: "coach@accredipro.com" },
        { role: "MENTOR" },
        { role: "ADMIN" },
      ],
    },
  });

  if (!sarah) {
    console.log('Creating Sarah (coach)...');
    const password = await bcrypt.hash('Coach123!', 12);
    sarah = await prisma.user.create({
      data: {
        email: 'coach@accredipro.com',
        passwordHash: password,
        firstName: 'Dr. Sarah',
        lastName: 'Mitchell',
        role: 'MENTOR',
        emailVerified: new Date(),
        isActive: true,
        bio: 'Board-certified Functional Medicine practitioner with 15+ years experience. Passionate about helping health professionals integrate functional medicine into their practice.',
      },
    });
  }
  console.log('Sarah ID:', sarah.id);

  // Create 175 student accounts
  console.log('Creating 175 student accounts...');
  const studentPassword = await bcrypt.hash('Student123!', 12);
  const students = [];

  for (let i = 0; i < usWomenNames.length; i++) {
    const name = usWomenNames[i];
    const email = `${name.first.toLowerCase()}.${name.last.toLowerCase().replace(/[^a-z]/g, '')}${Math.floor(Math.random() * 100)}@gmail.com`;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      students.push(existing);
      continue;
    }

    const student = await prisma.user.create({
      data: {
        email,
        passwordHash: studentPassword,
        firstName: name.first,
        lastName: name.last,
        role: 'STUDENT',
        emailVerified: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000), // Random date in last 90 days
        isActive: true,
        hasCompletedOnboarding: Math.random() > 0.1, // 90% have completed onboarding
        createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000),
      },
    });
    students.push(student);

    if (i % 25 === 0) {
      console.log(`Created ${i + 1}/${usWomenNames.length} students...`);
    }
  }
  console.log(`Created ${students.length} students`);

  // Create welcome posts for each category first
  console.log('Creating welcome posts for each category...');
  const welcomePostRecords = [];
  const now = new Date();
  const welcomeDate = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000); // 60 days ago

  for (const welcomePost of welcomePosts) {
    const post = await prisma.communityPost.create({
      data: {
        authorId: sarah.id,
        title: welcomePost.title,
        content: welcomePost.content,
        categoryId: welcomePost.category,
        isPinned: true, // All welcome posts are pinned
        createdAt: welcomeDate,
        updatedAt: welcomeDate,
      },
    });
    welcomePostRecords.push(post);
    console.log(`Created welcome post: "${welcomePost.title}" (${welcomePost.category})`);
  }

  // Create coaching tips posts (30 days retroactive) - all in "tips" category
  console.log('Creating 30 coaching tip posts...');
  const posts = [];

  for (let i = 0; i < coachingTips.length; i++) {
    const tip = coachingTips[i];
    const daysAgo = 30 - i; // First post is 30 days ago, last is today
    const postDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);

    const post = await prisma.communityPost.create({
      data: {
        authorId: sarah.id,
        title: tip.title,
        content: tip.content,
        categoryId: "tips", // All coaching tips are in the tips category
        isPinned: false, // Don't pin individual tips
        createdAt: postDate,
        updatedAt: postDate,
      },
    });
    posts.push(post);
    console.log(`Created post ${i + 1}/30: "${tip.title}"`);
  }

  // Helper function to get unique comments without repetition
  function getUniqueComments(availableComments: string[], count: number): string[] {
    const shuffled = [...availableComments].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(count, shuffled.length));
  }

  // Helper function to determine post type for generic comments
  function getPostType(title: string): 'weekly_wins' | 'tips_reflections' | 'freebie_friday' {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('wins') || lowerTitle.includes('celebration')) return 'weekly_wins';
    if (lowerTitle.includes('freebie') || lowerTitle.includes('script')) return 'freebie_friday';
    return 'tips_reflections';
  }

  // Add engagement to posts with contextual comments
  console.log('Adding engagement with contextual comments...');

  for (let i = 0; i < posts.length; i++) {
    const post = posts[i];
    const postSpecific = postSpecificComments[i];

    // Determine number of comments based on post position (older posts get more engagement)
    const baseComments = i === 0 ? 35 : (i < 10 ? 15 : 8); // First post gets most, older posts get more than newer
    const numComments = baseComments + Math.floor(Math.random() * 5);

    // Get comments - either from specific pool or generic
    let availableComments: string[];
    let availableSarahReplies: string[];

    if (postSpecific) {
      availableComments = postSpecific.comments;
      availableSarahReplies = postSpecific.sarahReplies;
    } else {
      const postType = getPostType(post.title);
      availableComments = genericCommentsByType[postType];
      availableSarahReplies = sarahGenericReplies;
    }

    // Get unique comments for this post
    const uniqueComments = getUniqueComments(availableComments, numComments);

    // Select random students for commenting
    const commentingStudents = students.sort(() => Math.random() - 0.5).slice(0, uniqueComments.length);

    let sarahReplyCount = 0;
    const maxSarahReplies = Math.min(availableSarahReplies.length, Math.floor(numComments * 0.3));

    for (let j = 0; j < commentingStudents.length; j++) {
      const student = commentingStudents[j];
      const commentContent = uniqueComments[j];
      const commentDate = new Date(post.createdAt.getTime() + Math.random() * 48 * 60 * 60 * 1000);

      const comment = await prisma.postComment.create({
        data: {
          postId: post.id,
          authorId: student.id,
          content: commentContent,
          createdAt: commentDate,
          updatedAt: commentDate,
        },
      });

      // Add replies to some comments (40% chance)
      if (Math.random() > 0.6) {
        const replyingStudent = students[Math.floor(Math.random() * students.length)];
        const replyTemplate = studentReplyTemplates[Math.floor(Math.random() * studentReplyTemplates.length)];
        const replyDate = new Date(commentDate.getTime() + Math.random() * 12 * 60 * 60 * 1000);

        await prisma.postComment.create({
          data: {
            postId: post.id,
            authorId: replyingStudent.id,
            content: replyTemplate,
            parentId: comment.id,
            createdAt: replyDate,
            updatedAt: replyDate,
          },
        });
      }

      // Sarah replies to some comments (about 30% of comments, using unique replies)
      if (sarahReplyCount < maxSarahReplies && Math.random() > 0.7) {
        const sarahReply = availableSarahReplies[sarahReplyCount];
        const sarahReplyDate = new Date(commentDate.getTime() + Math.random() * 6 * 60 * 60 * 1000);

        await prisma.postComment.create({
          data: {
            postId: post.id,
            authorId: sarah.id,
            content: sarahReply,
            parentId: comment.id,
            createdAt: sarahReplyDate,
            updatedAt: sarahReplyDate,
          },
        });
        sarahReplyCount++;
      }
    }

    // Add some likes to the post
    const numLikes = Math.floor(Math.random() * 30) + 10; // 10-40 likes per post
    const likingStudents = students.sort(() => Math.random() - 0.5).slice(0, numLikes);

    for (const student of likingStudents) {
      await prisma.postLike.create({
        data: {
          postId: post.id,
          userId: student.id,
          createdAt: new Date(post.createdAt.getTime() + Math.random() * 48 * 60 * 60 * 1000),
        },
      });
    }

    // Update post like count
    await prisma.communityPost.update({
      where: { id: post.id },
      data: { likeCount: numLikes },
    });

    if (i % 5 === 0 || i === posts.length - 1) {
      console.log(`Added engagement to ${i + 1}/${posts.length} posts...`);
    }
  }

  console.log('Community seed complete!');
  console.log(`Created ${students.length} students`);
  console.log(`Created ${welcomePostRecords.length} welcome posts (pinned)`);
  console.log(`Created ${posts.length} coaching tip posts`);
  console.log('All posts have contextual, unique comments with likes and replies');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
