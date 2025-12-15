/**
 * Seed Script: Create 500+ Community Posts (200 Wins + 300 Graduates)
 *
 * This script generates diverse, authentic-feeling posts using:
 * - Procedural generation with templates
 * - Multiple personas (nurses, teachers, single moms, retirees, men, international)
 * - Different writing styles (emotional, analytical, storytelling, list-heavy)
 * - Varied story elements and objections overcome
 *
 * Run with: npx tsx scripts/seed-massive-community-posts.ts
 */

import { PrismaClient, UserRole } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// ==================== DATA POOLS ====================

// First names pool (diverse backgrounds)
const FIRST_NAMES_FEMALE = [
  "Jennifer", "Amanda", "Victoria", "Lisa", "Diane", "Tammy", "Karyne", "Nancy", "Brandy", "Donna",
  "Julie", "Kira", "Suzette", "Joanne", "Kelly", "Allison", "Heather", "Priyanka", "Maria", "Rachel",
  "Michelle", "Sarah", "Christine", "Nicole", "Elizabeth", "Jessica", "Ashley", "Brittany", "Stephanie", "Lauren",
  "Megan", "Samantha", "Katherine", "Emily", "Rebecca", "Patricia", "Linda", "Barbara", "Susan", "Margaret",
  "Dorothy", "Karen", "Nancy", "Betty", "Helen", "Sandra", "Donna", "Carol", "Ruth", "Sharon",
  "Cynthia", "Kathleen", "Amy", "Angela", "Shirley", "Anna", "Brenda", "Pamela", "Emma", "Nicole",
  "Helen", "Samantha", "Katherine", "Christine", "Deborah", "Rachel", "Carolyn", "Janet", "Catherine", "Maria",
  "Heather", "Diane", "Ruth", "Julie", "Olivia", "Joyce", "Virginia", "Victoria", "Kelly", "Lauren",
  "Christina", "Joan", "Evelyn", "Judith", "Megan", "Andrea", "Cheryl", "Hannah", "Jacqueline", "Martha",
  "Gloria", "Teresa", "Ann", "Sara", "Madison", "Frances", "Kathryn", "Janice", "Jean", "Abigail",
  // International names
  "Priya", "Aisha", "Fatima", "Yuki", "Chen", "Mei", "Rosa", "Carmen", "Lena", "Sofia",
  "Ingrid", "Olga", "Natasha", "Svetlana", "Elena", "Gabriela", "Lucia", "Isabella", "Fernanda", "Ana",
  "Keiko", "Hiroko", "Kumiko", "Ayumi", "Sakura", "Jin", "Wei", "Ling", "Hui", "Xiao",
];

const FIRST_NAMES_MALE = [
  "Steven", "Michael", "David", "James", "Robert", "John", "William", "Richard", "Joseph", "Thomas",
  "Christopher", "Charles", "Daniel", "Matthew", "Anthony", "Mark", "Donald", "Steven", "Paul", "Andrew",
  "Joshua", "Kenneth", "Kevin", "Brian", "George", "Timothy", "Ronald", "Edward", "Jason", "Jeffrey",
  "Ryan", "Jacob", "Gary", "Nicholas", "Eric", "Jonathan", "Stephen", "Larry", "Justin", "Scott",
  "Brandon", "Benjamin", "Samuel", "Raymond", "Gregory", "Frank", "Alexander", "Patrick", "Jack", "Dennis",
  // International names
  "Carlos", "Miguel", "Jose", "Juan", "Pedro", "Ahmed", "Mohammed", "Ali", "Hassan", "Omar",
  "Raj", "Vikram", "Arjun", "Sanjay", "Amit", "Hiroshi", "Takeshi", "Kenji", "Wei", "Chen",
];

const LAST_NAMES = [
  "Thompson", "Foster", "Hayes", "Martinez", "Bartiromo", "Burks", "Martins", "Brooke", "Smieja", "McMenamin",
  "Frady", "Reoch", "Burke", "Bertrand", "McMahon", "Johnson", "King", "Thakur", "Simons", "Williams",
  "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Wilson", "Anderson", "Taylor", "Thomas",
  "Hernandez", "Moore", "Martin", "Jackson", "Lee", "Perez", "White", "Harris", "Sanchez", "Clark",
  "Ramirez", "Lewis", "Robinson", "Walker", "Young", "Allen", "King", "Wright", "Scott", "Torres",
  "Nguyen", "Hill", "Flores", "Green", "Adams", "Nelson", "Baker", "Hall", "Rivera", "Campbell",
  "Mitchell", "Carter", "Roberts", "Gomez", "Phillips", "Evans", "Turner", "Diaz", "Parker", "Cruz",
  "Edwards", "Collins", "Reyes", "Stewart", "Morris", "Morales", "Murphy", "Cook", "Rogers", "Gutierrez",
  "O'Brien", "McCarthy", "Sullivan", "Murphy", "Kennedy", "Walsh", "O'Connor", "Kelly", "Ryan", "Byrne",
  "Patel", "Shah", "Kumar", "Singh", "Sharma", "Gupta", "Muller", "Schmidt", "Weber", "Fischer",
];

// Avatar URLs (Unsplash professional photos)
const AVATAR_URLS = [
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
  // Male avatars
  "https://images.unsplash.com/photo-1557862921-37829c790f19?w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1463453091185-61582044d556?w=150&h=150&fit=crop&crop=face",
];

// ==================== PERSONA TYPES ====================

interface Persona {
  type: string;
  backgrounds: string[];
  struggles: string[];
  transformations: string[];
  specialties: string[];
  ages: number[];
}

const PERSONAS: Persona[] = [
  {
    type: "nurse",
    backgrounds: [
      "ER nurse for {years} years",
      "ICU nurse with {years} years experience",
      "Med-Surg nurse, {years} years in the trenches",
      "Flight nurse for {years} years",
      "Oncology nurse since {year}",
      "Cardiac care nurse for {years} years",
      "NICU nurse with {years} years of experience",
      "Home health nurse for {years} years",
      "Hospice nurse, {years} years of end-of-life care",
      "OR nurse for {years} years",
    ],
    struggles: [
      "completely burned out from 12-hour shifts",
      "tired of watching patients get sicker instead of better",
      "frustrated with the 'sick care' system",
      "exhausted from hospital politics",
      "worn out by insurance companies dictating care",
      "fed up with 5 minutes per patient",
      "drained from seeing the same patients return",
      "overwhelmed by charting and paperwork",
    ],
    transformations: [
      "now helping patients actually heal",
      "finally feel like a real healer",
      "love going to work again",
      "making more than my hospital salary",
      "spending real time with patients",
      "actually see people get better",
      "no more 5 AM alarm clock",
      "work from home in my pajamas",
    ],
    specialties: [
      "thyroid issues", "autoimmune conditions", "chronic fatigue", "gut health",
      "hormone imbalances", "burnout recovery", "menopause", "PCOS",
    ],
    ages: [35, 38, 42, 45, 48, 52, 55, 58, 62],
  },
  {
    type: "nurse_practitioner",
    backgrounds: [
      "ARNP with {years} years in primary care",
      "Family Nurse Practitioner for {years} years",
      "Women's Health NP since {year}",
      "Pediatric NP with {years} years experience",
      "Psychiatric NP for {years} years",
    ],
    struggles: [
      "spending more time on paperwork than patients",
      "watched healthcare become about insurance not healing",
      "frustrated prescribing the same meds that don't work",
      "tired of 15-minute appointments",
      "burned out from the corporate healthcare machine",
    ],
    transformations: [
      "finally charging what my expertise is worth",
      "no insurance companies telling me what to do",
      "actually have time to listen to patients",
      "seeing real results for the first time",
      "using my {years} years of knowledge properly",
    ],
    specialties: [
      "complex chronic illness", "medication optimization", "preventive care",
      "integrative approaches", "root cause analysis",
    ],
    ages: [40, 45, 48, 52, 55, 58, 62, 65],
  },
  {
    type: "single_mom",
    backgrounds: [
      "single mom of {kids} kids",
      "divorced mom raising {kids} children alone",
      "single mother working {job} while raising {kids}",
      "widowed mom with {kids} kids to support",
    ],
    struggles: [
      "had zero time between work and kids",
      "couldn't afford another program that wouldn't work",
      "everyone said I was crazy to try this",
      "studied during school pickup and naptime",
      "did modules at 11 PM after kids went to bed",
    ],
    transformations: [
      "now paying for kids' activities with coaching income",
      "finally have a career that works around my family",
      "showing my kids mom can do hard things",
      "building something for our future",
      "can actually be there for school events",
    ],
    specialties: [
      "busy moms", "women's health", "stress management", "work-life balance",
    ],
    ages: [32, 35, 38, 42, 45],
  },
  {
    type: "retiree",
    backgrounds: [
      "retired after {years} years in healthcare",
      "thought retirement would be relaxing at {age}",
      "hung up my nursing scrubs after {years} years",
      "left hospital work at {age}",
    ],
    struggles: [
      "was bored out of my mind within weeks",
      "missed having purpose every day",
      "my spouse was ready to build me an office in the garage",
      "felt useless without my career identity",
      "thought I was too old to learn something new",
    ],
    transformations: [
      "found my purpose again at {age}",
      "proving age is just a number",
      "starting the best chapter at {age}",
      "more fulfilled than my entire nursing career",
      "my {years} years of experience finally valued",
    ],
    specialties: [
      "seniors health", "menopause", "aging gracefully", "chronic disease prevention",
    ],
    ages: [62, 64, 65, 67, 68, 70],
  },
  {
    type: "chronic_illness_survivor",
    backgrounds: [
      "diagnosed with {condition} {years} years ago",
      "struggled with {condition} for over a decade",
      "suffered from {condition} that doctors couldn't figure out",
      "nearly gave up after {years} years of {condition}",
    ],
    struggles: [
      "saw {num} doctors who all said I was 'fine'",
      "spent $${amount} on specialists with no answers",
      "was told it was 'all in my head'",
      "given antidepressants instead of real help",
      "had to become my own health detective",
    ],
    transformations: [
      "now in remission and helping others",
      "turned my pain into my purpose",
      "helping others skip the diagnostic nightmare",
      "my suffering wasn't for nothing",
      "using my experience to help others heal",
    ],
    specialties: [
      "Hashimoto's", "Lyme disease", "chronic fatigue", "autoimmune conditions",
      "fibromyalgia", "lupus", "PCOS", "endometriosis",
    ],
    ages: [35, 38, 42, 45, 48, 52],
  },
  {
    type: "teacher",
    backgrounds: [
      "taught {subject} for {years} years",
      "retired teacher after {years} years in education",
      "former high school {subject} teacher",
      "spent {years} years in the classroom",
    ],
    struggles: [
      "didn't have medical background, felt like imposter",
      "wondered if I could really do this",
      "was 'just a teacher'",
      "had zero business experience",
    ],
    transformations: [
      "{years} years of explaining complex topics is my superpower",
      "my teaching background is my advantage",
      "turns out I was already trained for this",
      "creating 'lesson plans' for my clients",
    ],
    specialties: [
      "health education", "lifestyle coaching", "nutrition basics", "stress management",
    ],
    ages: [55, 58, 60, 62, 65],
  },
  {
    type: "male_fitness",
    backgrounds: [
      "former personal trainer and gym owner",
      "bodybuilding competitor in the {decade}s",
      "fitness professional for {years} years",
      "ran a gym for {years} years before life happened",
    ],
    struggles: [
      "put my passion on the back burner for family",
      "knew something was missing from traditional fitness",
      "saw clients plateau no matter what they did",
      "wanted to understand the WHY behind health",
    ],
    transformations: [
      "finally understand the hormone connection",
      "can explain why some clients plateau",
      "added the missing piece to my fitness knowledge",
      "helping men my age optimize without killing themselves in the gym",
    ],
    specialties: [
      "men's health", "hormone optimization", "fitness after 50", "performance",
    ],
    ages: [55, 58, 62, 65, 68],
  },
  {
    type: "international",
    backgrounds: [
      "nurse from {country} looking to practice differently",
      "healthcare worker from {country}",
      "moved from {country} and wanted a fresh start",
      "working {timezone} hours to make this happen",
    ],
    struggles: [
      "wondered if certification would work in my country",
      "worried about time zones and live calls",
      "wasn't sure if the labs applied internationally",
      "had to take exams at 4 AM my time",
    ],
    transformations: [
      "the knowledge is universal - bodies work the same everywhere",
      "now the only functional medicine coach in my area",
      "zero competition because no one knows this exists here yet",
      "blue ocean instead of red ocean",
    ],
    specialties: [
      "international clients", "remote coaching", "cultural approaches to health",
    ],
    ages: [35, 38, 42, 45, 48, 52],
  },
  {
    type: "cancer_survivor",
    backgrounds: [
      "diagnosed with {cancer_type} cancer {years} years ago",
      "went through {treatment} and survived",
      "cancer survivor since {year}",
      "beat {cancer_type} cancer against the odds",
    ],
    struggles: [
      "lying in that hospital bed changed everything",
      "had a lot of time to think during chemo",
      "realized if I had known then what I know now",
      "made a promise to myself in the treatment chair",
    ],
    transformations: [
      "if I survive this I'm helping others prevent it",
      "some of the best healers are wounded healers",
      "my cancer became my calling",
      "turning my experience into prevention for others",
    ],
    specialties: [
      "cancer prevention", "survivorship", "lifestyle medicine", "nutrition for recovery",
    ],
    ages: [45, 48, 52, 55, 58],
  },
];

// ==================== STORY TEMPLATES ====================

// WINS post templates
const WINS_TEMPLATES = [
  // First client signed
  {
    title: "Just signed my FIRST paying client! {emotion}",
    intro: [
      "You guys... I have to share this because I honestly can't believe it.",
      "I'm literally shaking as I type this.",
      "This is happening. THIS IS REALLY HAPPENING.",
      "I need to tell someone who understands why this matters.",
    ],
    sarahMention: [
      "I messaged Coach Sarah at {time} completely overwhelmed. She called me the NEXT MORNING and spent an hour walking me through everything.",
      "Sarah sent me a voice message that completely changed my perspective.",
      "When I was ready to give up, Sarah reminded me why I started this journey.",
      "Coach Sarah's advice on discovery calls was the game-changer.",
    ],
    transformation: [
      "After {time_period}, she said YES.",
      "They signed on the spot.",
      "Not only did they say yes, they referred their sister too.",
      "They asked if they could pay for 6 months upfront.",
    ],
    emotion_end: [
      "I'm sitting in my car crying as I write this because it feels SO REAL now.",
      "I ugly cried for 20 minutes straight.",
      "My husband thinks I'm crazy but he's also kind of proud.",
      "I called my mom first. She cried too.",
    ],
  },
  // Income milestone
  {
    title: "From $0 to ${amount}/month in {months} months - here's what worked",
    intro: [
      "I promised myself I'd share when I hit consistent income.",
      "Real talk: The first few months were brutal.",
      "I know some of you are where I was {months} months ago.",
      "Finally ready to share my journey from zero to ${amount}.",
    ],
    sarahMention: [
      "What changed everything was something Sarah told me: '{advice}'",
      "Sarah's advice to '{advice}' was the turning point.",
      "One voice message from Sarah shifted everything.",
      "Coach Sarah saw what I couldn't see in myself.",
    ],
    whatChanged: [
      "I stopped trying to help everyone and picked ONE niche.",
      "I started being real and vulnerable instead of 'professional'.",
      "I followed up like my business depended on it. Because it does.",
      "I used the Business Launch Kit templates - they saved me hours.",
    ],
    encouragement: [
      "To anyone in months 1-3: it's working. You just can't see it yet.",
      "Your person is out there waiting for you.",
      "Don't give up when you're this close.",
      "The compound effect is real. Keep showing up.",
    ],
  },
  // Quit job story
  {
    title: "I quit my {job} job today. {emotion}",
    intro: [
      "I walked into HR this morning and handed in my resignation.",
      "Today I did something I never thought I'd have the courage to do.",
      "{years} years. Gone. And I couldn't be happier.",
      "My manager looked at me like I'd lost my mind.",
    ],
    contrast: [
      "What they don't know: I've already replaced my income.",
      "Plot twist: I'm making MORE now than I ever did at the hospital.",
      "They think I'm crazy. But they don't see my bank account.",
      "I didn't quit TO become a health coach. I quit BECAUSE I already was one.",
    ],
    sarahMention: [
      "When I told Sarah I was scared to quit, she said: '{advice}'",
      "Sarah reminded me: '{advice}'",
      "Coach Sarah helped me see what I couldn't see.",
      "Sarah's belief in me gave me courage to believe in myself.",
    ],
    newLife: [
      "No more {time} alarm clock. No more {pain_point}.",
      "I actually help people get BETTER now.",
      "Work from home. Set my own hours. Do what I love.",
      "Christmas gift to myself: freedom.",
    ],
  },
  // Client success story
  {
    title: "My client just {achievement} and I ugly cried for {minutes} minutes",
    intro: [
      "When I started working with {client_name} {time_ago}, they could barely {struggle}.",
      "I have to share this client win because THIS is why we do this.",
      "Got a text from my client today that made me lose it.",
      "Sometimes this job feels hard. Then you get messages like this.",
    ],
    clientJourney: [
      "They'd been to {num} doctors. Everyone told them '{dismissal}'.",
      "The medical system had completely failed them.",
      "They'd almost given up hope after {years} years of trying.",
      "Every specialist said there was nothing more they could do.",
    ],
    whatWeDid: [
      "Using what I learned in the program, we ran proper labs and found {finding}.",
      "We did what their doctors should have done: looked at the ROOT CAUSE.",
      "Module {num}'s protocol was exactly what they needed.",
      "We followed Sarah's approach and everything clicked.",
    ],
    result: [
      "Today they texted: '{quote}'",
      "They just {achievement} for the first time in {years} years.",
      "Their doctor couldn't believe the transformation.",
      "They're living their life again. REALLY living it.",
    ],
  },
  // Mom win / Family story
  {
    title: "This isn't a business win. This is a {relationship} win. {emotion}",
    intro: [
      "And honestly, it means more to me than any client payment ever could.",
      "I have to share something personal today.",
      "Sometimes the biggest wins aren't about money.",
      "This one hit different.",
    ],
    familyStruggle: [
      "My {relationship} has been {struggle} for {years} years.",
      "Every doctor said they were 'fine'. They weren't fine.",
      "We'd tried everything. Nothing worked.",
      "I felt like a failure. I couldn't help my own family.",
    ],
    breakthrough: [
      "Then I learned about {topic} in Module {num}. Something clicked.",
      "Sarah teaches about {topic} and I finally understood.",
      "What I learned in this program gave me the tools to help.",
      "The functional medicine approach found what everyone else missed.",
    ],
    emotionalEnd: [
      "Three months later, they {result}. I'm crying typing this.",
      "Yesterday they {result} for the first time in years.",
      "Thank God I didn't give up on this program. Or my family.",
      "My {relationship} has their life back. Because I kept going.",
    ],
  },
];

// GRADUATES post templates
const GRADUATES_TEMPLATES = [
  // Traditional nursing background
  {
    title: "After {years} years as {role}... I'M OFFICIALLY CERTIFIED! {emoji}",
    intro: [
      "It's official! I just received my Certified Functional Medicine Practitioner credential!",
      "{years} years of {frustration}. {years} years of {pain}. No more.",
      "I did it. I actually did it.",
      "The email came through this morning. I'm certified.",
    ],
    journey: [
      "This started because I was sick myself. {condition} that no one could figure out.",
      "I watched too many patients {struggle} while we just managed their decline.",
      "The 'sick care' system broke something in me. I needed a better way.",
      "I always knew there had to be more than pills and prescriptions.",
    ],
    sarahMention: [
      "When I messaged Sarah after passing, she sent me a voice note that made me cry: '{quote}'",
      "Sarah told me something I'll never forget: '{quote}'",
      "Coach Sarah believed in me when I didn't believe in myself.",
      "Sarah's response when I passed: '{quote}'",
    ],
    whatLearned: [
      "How to actually READ labs, not just check if they're 'normal'",
      "The gut-brain-hormone connection that explains SO MUCH",
      "How to help people heal, not just manage their conditions",
      "That I'm not crazy for believing there's a better way",
    ],
    nextSteps: [
      "Building my practice helping {niche}.",
      "Already have {num} clients lined up.",
      "Starting Chapter 2 of my career. The best chapter.",
      "Ready to do what I was always meant to do.",
    ],
  },
  // Emotional / memorial story
  {
    title: "Certified at last. {person}, this one's for you {emoji}",
    intro: [
      "I passed my certification exam this morning. First person I wanted to call can't answer.",
      "Today I'm celebrating with tears, not champagne.",
      "This certification is dedicated to someone who can't see it.",
      "Some achievements come with complicated emotions.",
    ],
    backstory: [
      "My {person} passed away {time_ago}. {condition} that could have been prevented.",
      "They trusted their doctors completely. The system failed them.",
      "After they passed, I couldn't go back to {old_job}. Something broke in me.",
      "Grief doesn't go away. But it can become fuel.",
    ],
    sarahMention: [
      "When I told Sarah about my {person}, she didn't give platitudes. She said: '{quote}'",
      "Sarah understood my grief in a way no one else did.",
      "Coach Sarah helped me channel my pain into purpose.",
      "Sarah reminded me that my {person}'s death can prevent others'.",
    ],
    purpose: [
      "I promise: I'm going to help others avoid what happened to you.",
      "This certification means more than a piece of paper. It's a promise.",
      "Your death will not be in vain.",
      "Every client I help honors your memory.",
    ],
  },
  // Age-defying story
  {
    title: "Certified at {age}! Proof it's never too late {emoji}",
    intro: [
      "After {years} years as {role}, I thought retirement would be relaxing. I was bored in {weeks} weeks.",
      "My kids thought I was crazy. My spouse thought I was bored. They were both right.",
      "At {age}, most people are slowing down. Not me.",
      "They say you can't teach an old dog new tricks. They're wrong.",
    ],
    fears: [
      "I was TERRIFIED of the technology. Barely knew how to use Zoom.",
      "Everyone would be young Instagram influencer types.",
      "My brain couldn't handle new information at this age.",
      "I'd be the oldest person in the program.",
    ],
    sarahMention: [
      "Sarah laughed when I shared my fears and said: '{quote}'",
      "Coach Sarah reminded me: '{quote}'",
      "Sarah never made me feel too old for this dream.",
      "When I called myself 'too old,' Sarah shut that down fast.",
    ],
    advantages: [
      "My {years} years of experience is my SUPERPOWER, not my limitation.",
      "I've seen what works and what doesn't - for decades.",
      "Clients trust me BECAUSE of my age and wisdom.",
      "Younger students actually value our experience.",
    ],
    encouragement: [
      "To my fellow 'mature' students: Do it. Your decades matter.",
      "Age is just a number. Passion has no expiration date.",
      "Here's to Chapter 2 at {age}!",
      "The best chapter of my life started after {age}.",
    ],
  },
  // International student
  {
    title: "Certified from {country}! {emoji} Proof this works internationally",
    intro: [
      "For all my international folks wondering if this works outside the US - IT DOES!",
      "I'm in {country}. {distance} from the US. And I just passed!",
      "When I found this program, I had 47 questions about whether it would work here.",
      "International student success story coming through!",
    ],
    concerns: [
      "Will this certification be recognized in {country}?",
      "Time zones - will I miss all the live content?",
      "Do we even have these labs in {country}?",
      "Can I practice with this credential here?",
    ],
    sarahMention: [
      "Sarah responded to every single question I had.",
      "Coach Sarah helped me find {country}-specific resources.",
      "Sarah's advice: '{quote}'",
      "She connected me with {num} other students from {region}!",
    ],
    advantages: [
      "Took the exam at {time} to align with US testing - dedication!",
      "I'm now the ONLY functional medicine coach in my entire area.",
      "Zero competition because no one here knows this exists yet.",
      "Blue ocean, not red ocean - exactly like Sarah says.",
    ],
    encouragement: [
      "Don't let geography stop you. This transcends borders.",
      "The knowledge is universal. Bodies work the same everywhere.",
      "Your country might be the next frontier for functional medicine.",
      "To my fellow internationals - we've got this!",
    ],
  },
  // Non-medical background
  {
    title: "Certified without a medical degree! Here's how {emoji}",
    intro: [
      "I spent {years} years as {role}. I'm NOT a nurse or doctor. But I did it.",
      "No medical background. No healthcare experience. Just passion and hard work.",
      "When I enrolled, I felt like a complete imposter.",
      "Proof you don't need to be a nurse to do this.",
    ],
    imposterSyndrome: [
      "I told Sarah I was 'just a {role}.' Her response changed everything.",
      "Everyone else seemed to have medical credentials. I had {background}.",
      "I almost quit in week 2. Thought I didn't belong.",
      "Who was I to help people with health?",
    ],
    sarahMention: [
      "Sarah's response to my doubts: '{quote}'",
      "Coach Sarah helped me see my background as an ADVANTAGE.",
      "She said: '{quote}' and everything clicked.",
      "Sarah reminded me that my {years} years of {skill} was exactly what I needed.",
    ],
    advantages: [
      "My {background} taught me to break down complex topics simply.",
      "I'm patient with people who don't understand - that's my training.",
      "I can create 'lesson plans' for my clients.",
      "My non-medical perspective is actually refreshing for clients.",
    ],
    result: [
      "Passed the exam. Certified. Building my practice.",
      "Already have {num} clients who love my approach.",
      "Your background isn't a limitation. It's your unique superpower.",
      "Sarah was right. I was already prepared.",
    ],
  },
];

// ==================== SARAH QUOTES ====================

const SARAH_QUOTES = [
  "You're not here to unlearn everything. You're here to ADD to your foundation.",
  "Your experience is invaluable - we're just filling in what medical school left out.",
  "You don't need to be the smartest practitioner. Just ask the questions no one else is asking.",
  "Your mess becomes your message. Your struggle becomes your superpower.",
  "Some of the best healers are wounded healers.",
  "30 focused minutes beats 3 scattered hours.",
  "If you can navigate a hospital's EMR system, you can learn anything.",
  "You're not leaving nursing. You're EVOLVING it.",
  "Your age is your ADVANTAGE, not your limitation.",
  "Your calling to help people never went away - that's why you're here.",
  "Grief is fuel when channeled right.",
  "You've been running a mini business for years - you're more prepared than you think.",
  "Those other programs give you PhD-level knowledge. We give you street-level skills.",
  "Blue ocean, not red ocean. Go where no one else is.",
  "Trust what you learned. You know more than those doctors now.",
  "Pick ONE person with ONE problem that YOU understand deeply.",
  "Stop trying to look professional. Start being real.",
  "Your suffering wasn't for nothing. It was training.",
  "The knowledge is universal - bodies work the same everywhere.",
  "Don't let anyone tell you you're too old for this.",
];

// ==================== HELPER FUNCTIONS ====================

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateName(isMale: boolean): { first: string; last: string } {
  const first = isMale
    ? randomFrom(FIRST_NAMES_MALE)
    : randomFrom(FIRST_NAMES_FEMALE);
  const last = randomFrom(LAST_NAMES);
  return { first, last };
}

function fillTemplate(template: string, vars: Record<string, string | number>): string {
  let result = template;
  for (const [key, value] of Object.entries(vars)) {
    result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), String(value));
  }
  return result;
}

// ==================== POST GENERATORS ====================

function generateWinsPost(index: number): { title: string; content: string; authorName: { first: string; last: string }; avatar: string; viewCount: number; daysAgo: number } {
  const isMale = Math.random() < 0.15; // 15% male
  const persona = randomFrom(PERSONAS);
  const template = randomFrom(WINS_TEMPLATES);
  const authorName = generateName(isMale);

  const vars: Record<string, string | number> = {
    years: randomInt(8, 35),
    year: randomInt(1995, 2020),
    age: randomFrom(persona.ages),
    months: randomInt(3, 8),
    amount: randomInt(2, 12) * 1000,
    time: randomFrom(["2am", "midnight", "11pm", "3am"]),
    time_period: randomFrom(["45 minutes", "an hour", "our first call", "the discovery call"]),
    emotion: randomFrom(["I'm literally crying", "My hands are shaking", "I can't believe it", "Is this real life??"]),
    emoji: randomFrom(["🎉", "😭", "💪", "🙌", "❤️", "🔥"]),
    job: randomFrom(["nursing", "hospital", "healthcare", "clinic"]),
    client_name: randomFrom(["Maria", "Susan", "Jennifer", "Linda", "Patricia"]),
    struggle: randomFrom(["get out of bed", "think clearly", "make it through the day", "function normally"]),
    time_ago: randomFrom(["3 months ago", "6 months ago", "last year"]),
    num: randomInt(5, 23),
    dismissal: randomFrom(["your labs look fine", "it's just stress", "you're depressed", "it's all in your head"]),
    finding: randomFrom(["SIBO", "candida overgrowth", "hidden food sensitivities", "tanked cortisol", "thyroid dysfunction"]),
    quote: randomFrom([
      "I went hiking with my daughter yesterday. HIKING. For the first time in 3 years.",
      "I have my life back. Thank you for not giving up on me.",
      "My doctor couldn't believe my labs. Asked what I was doing differently.",
      "I feel like myself again. I forgot what that felt like.",
    ]),
    achievement: randomFrom(["went hiking", "played with her grandkids", "got off her medications", "went back to work"]),
    relationship: randomFrom(["MOM", "DAUGHTER", "SISTER", "family"]),
    topic: randomFrom(["the HPA axis", "adrenal dysfunction", "cortisol patterns", "gut-brain connection"]),
    result: randomFrom(["hasn't had an episode", "is thriving", "is back to normal", "is living their life again"]),
    advice: randomFrom(SARAH_QUOTES),
    condition: randomFrom(persona.specialties),
    kids: randomInt(2, 4),
    minutes: randomInt(15, 30),
    pain_point: randomFrom(["mandatory overtime", "short staffing", "charting until midnight", "toxic coworkers"]),
  };

  // Generate title
  const title = fillTemplate(template.title, vars);

  // Generate content with proper HTML
  const paragraphs: string[] = [];

  // Intro
  paragraphs.push(`<p>${randomFrom(template.intro)}</p>`);

  // Background (from persona)
  const background = fillTemplate(randomFrom(persona.backgrounds), vars);
  const struggle = randomFrom(persona.struggles);
  paragraphs.push(`<p>${background}. I was ${struggle}.</p>`);

  // Story middle (varies by template type)
  if ('sarahMention' in template) {
    paragraphs.push(`<p>${fillTemplate(randomFrom(template.sarahMention), vars)}</p>`);
  }

  if ('transformation' in template) {
    paragraphs.push(`<p>${fillTemplate(randomFrom(template.transformation), vars)}</p>`);
    const priceOptions = ["$" + vars.amount, "$" + randomInt(800, 3000), "$" + randomInt(1500, 5000)];
    const durationOptions = ["3-month", "6-month", "12-week"];
    paragraphs.push(`<p><strong>${randomFrom(priceOptions)} for a ${randomFrom(durationOptions)} package.</strong></p>`);
  }

  if ('whatChanged' in template) {
    paragraphs.push(`<p><strong>What changed everything:</strong></p>`);
    paragraphs.push(`<ul>`);
    for (let i = 0; i < randomInt(3, 5); i++) {
      paragraphs.push(`<li>${randomFrom(template.whatChanged)}</li>`);
    }
    paragraphs.push(`</ul>`);
  }

  if ('clientJourney' in template) {
    paragraphs.push(`<p>${fillTemplate(randomFrom(template.clientJourney), vars)}</p>`);
  }

  if ('whatWeDid' in template) {
    paragraphs.push(`<p>${fillTemplate(randomFrom(template.whatWeDid), vars)}</p>`);
  }

  if ('result' in template) {
    paragraphs.push(`<p>${fillTemplate(randomFrom(template.result), vars)}</p>`);
  }

  if ('contrast' in template) {
    paragraphs.push(`<p>${fillTemplate(randomFrom(template.contrast), vars)}</p>`);
  }

  if ('newLife' in template) {
    paragraphs.push(`<p>${fillTemplate(randomFrom(template.newLife), vars)}</p>`);
  }

  if ('familyStruggle' in template) {
    paragraphs.push(`<p>${fillTemplate(randomFrom(template.familyStruggle), vars)}</p>`);
  }

  if ('breakthrough' in template) {
    paragraphs.push(`<p>${fillTemplate(randomFrom(template.breakthrough), vars)}</p>`);
  }

  // Emotion ending
  if ('emotion_end' in template) {
    paragraphs.push(`<p>${randomFrom(template.emotion_end)}</p>`);
  }

  if ('emotionalEnd' in template) {
    paragraphs.push(`<p>${fillTemplate(randomFrom(template.emotionalEnd), vars)}</p>`);
  }

  if ('encouragement' in template) {
    paragraphs.push(`<p>${randomFrom(template.encouragement)}</p>`);
  }

  // Thank Sarah
  paragraphs.push(`<p>Thank you Coach Sarah and this amazing community. I couldn't have done it without you. ${randomFrom(["💕", "❤️", "🙏", "💪", "🔥"])}</p>`);

  const content = paragraphs.join('\n\n');

  return {
    title,
    content,
    authorName,
    avatar: randomFrom(AVATAR_URLS),
    viewCount: randomInt(1500, 9000),
    daysAgo: randomInt(1, 90),
  };
}

function generateGraduatesPost(index: number): { title: string; content: string; authorName: { first: string; last: string }; avatar: string; viewCount: number; daysAgo: number } {
  const isMale = Math.random() < 0.15; // 15% male
  const persona = randomFrom(PERSONAS);
  const template = randomFrom(GRADUATES_TEMPLATES);
  const authorName = generateName(isMale);

  const countries = ["Australia", "UK", "Canada", "Germany", "Netherlands", "Ireland", "New Zealand", "Singapore", "India", "Brazil"];
  const regions = ["APAC", "Europe", "South America", "Asia"];

  const vars: Record<string, string | number> = {
    years: randomInt(10, 40),
    year: randomInt(1990, 2020),
    age: randomFrom(persona.ages),
    role: randomFrom(["an RN", "a nurse", "an NP", "a healthcare worker", "a teacher", "in corporate"]),
    frustration: randomFrom(["frustration with the system", "watching patients decline", "feeling powerless", "burnout"]),
    pain: randomFrom(["treating symptoms instead of causes", "prescription after prescription", "the revolving door of sick patients"]),
    condition: randomFrom(persona.specialties),
    struggle: randomFrom(["get sicker instead of better", "return with the same issues", "give up hope"]),
    quote: randomFrom(SARAH_QUOTES),
    niche: randomFrom(persona.specialties),
    num: randomInt(2, 8),
    person: randomFrom(["mom", "dad", "sister", "brother", "best friend", "grandmother"]),
    time_ago: randomFrom(["last year", "two years ago", "18 months ago"]),
    old_job: randomFrom(["the hospital", "nursing", "my old career"]),
    emoji: randomFrom(["🎓", "🎉", "💪", "🙌", "❤️", "🔥", "✨"]),
    weeks: randomInt(3, 8),
    country: randomFrom(countries),
    region: randomFrom(regions),
    distance: randomFrom(["10,000 miles", "thousands of miles", "halfway around the world"]),
    time: randomFrom(["4am", "3am", "5am"]),
    background: randomFrom(["teaching", "corporate", "customer service", "sales"]),
    skill: randomFrom(["explaining complex topics", "connecting with people", "problem-solving", "patience"]),
    treatment: randomFrom(["chemo", "radiation", "surgery", "treatment"]),
    cancer_type: randomFrom(["breast", "ovarian", "thyroid", "lymphoma"]),
  };

  // Generate title
  const title = fillTemplate(template.title, vars);

  // Generate content with proper HTML
  const paragraphs: string[] = [];

  // Intro
  paragraphs.push(`<p>${fillTemplate(randomFrom(template.intro), vars)}</p>`);

  // Journey/Backstory
  if ('journey' in template) {
    paragraphs.push(`<p>${fillTemplate(randomFrom(template.journey), vars)}</p>`);
  }

  if ('backstory' in template) {
    paragraphs.push(`<p>${fillTemplate(randomFrom(template.backstory), vars)}</p>`);
  }

  if ('fears' in template) {
    paragraphs.push(`<p>My biggest fears:</p><ul>`);
    for (const fear of template.fears.slice(0, randomInt(2, 4))) {
      paragraphs.push(`<li>${fear}</li>`);
    }
    paragraphs.push(`</ul>`);
  }

  if ('concerns' in template) {
    paragraphs.push(`<p>My concerns before enrolling:</p><ul>`);
    for (const concern of template.concerns.slice(0, randomInt(2, 4))) {
      paragraphs.push(`<li>${fillTemplate(concern, vars)}</li>`);
    }
    paragraphs.push(`</ul>`);
  }

  if ('imposterSyndrome' in template) {
    paragraphs.push(`<p>${fillTemplate(randomFrom(template.imposterSyndrome), vars)}</p>`);
  }

  // Sarah mention
  if ('sarahMention' in template) {
    paragraphs.push(`<p>${fillTemplate(randomFrom(template.sarahMention), vars)}</p>`);
  }

  // What learned / Advantages
  if ('whatLearned' in template) {
    paragraphs.push(`<p><strong>What this program taught me that no one else did:</strong></p><ul>`);
    for (const item of template.whatLearned) {
      paragraphs.push(`<li>${item}</li>`);
    }
    paragraphs.push(`</ul>`);
  }

  if ('advantages' in template) {
    paragraphs.push(`<p><strong>What surprised me most:</strong></p><ul>`);
    for (const adv of template.advantages.slice(0, randomInt(2, 4))) {
      paragraphs.push(`<li>${fillTemplate(adv, vars)}</li>`);
    }
    paragraphs.push(`</ul>`);
  }

  // Purpose / Result
  if ('purpose' in template) {
    paragraphs.push(`<p>${fillTemplate(randomFrom(template.purpose), vars)}</p>`);
  }

  if ('result' in template) {
    paragraphs.push(`<p>${fillTemplate(randomFrom(template.result), vars)}</p>`);
  }

  // Next steps
  if ('nextSteps' in template) {
    paragraphs.push(`<p><strong>What's next:</strong> ${fillTemplate(randomFrom(template.nextSteps), vars)}</p>`);
  }

  // Encouragement
  if ('encouragement' in template) {
    paragraphs.push(`<p>${fillTemplate(randomFrom(template.encouragement), vars)}</p>`);
  }

  // Thank Sarah
  paragraphs.push(`<p>Thank you Coach Sarah. Thank you AccrediPro. Thank you to this incredible community. ${randomFrom(["🙏", "❤️", "💪", "🎓", "🚀"])}</p>`);

  const content = paragraphs.join('\n\n');

  return {
    title,
    content,
    authorName,
    avatar: randomFrom(AVATAR_URLS),
    viewCount: randomInt(1200, 8000),
    daysAgo: randomInt(1, 120),
  };
}

// Sarah's comment templates
const SARAH_COMMENTS = [
  "This brought tears to my eyes! Your journey is exactly why I do this work. So proud of you! 💕",
  "YES! This is what it's all about. Your story will inspire so many others. Keep shining!",
  "I remember when you first reached out. Look at you now! So proud of your transformation!",
  "Reading this gave me goosebumps. You've worked so hard for this moment. Celebrate it fully!",
  "This is why we built this community. Stories like yours change lives. Thank you for sharing!",
  "Your dedication has been incredible to witness. This is just the beginning for you!",
  "I knew from our first conversation that you had something special. Now the world knows too!",
  "So proud of everything you've accomplished. Your clients are so lucky to have you!",
  "This made my whole week! Your success story will help others believe it's possible for them too.",
  "The way you've grown and transformed is absolutely inspiring. Can't wait to see what's next!",
  "Thank you for trusting the process even when it felt hard. THIS is the payoff!",
  "Your story is proof that anyone with passion and dedication can do this. So proud!",
  "I love watching you step into your power. You were always capable - now you KNOW it!",
  "This is everything! Your willingness to be vulnerable and share your journey is a gift to this community.",
  "Reading this, I just want everyone to know that {name} put in the WORK. This success was earned!",
];

// ==================== MAIN FUNCTION ====================

async function main() {
  console.log("🚀 Starting massive community posts seed...\n");

  // Find or create Sarah coach user
  let sarahUser = await prisma.user.findFirst({
    where: { email: "sarah@accredipro-certificate.com" }
  });

  if (!sarahUser) {
    console.log("Creating Sarah coach user...");
    sarahUser = await prisma.user.create({
      data: {
        email: "sarah@accredipro-certificate.com",
        firstName: "Sarah",
        lastName: "Mitchell",
        avatar: "/coaches/sarah-coach.webp",
        role: UserRole.MENTOR,
      }
    });
  }

  // Delete old seeded posts (keep real user posts)
  console.log("Cleaning up old seeded posts...");
  await prisma.postComment.deleteMany({
    where: {
      post: {
        author: {
          email: { contains: "@zombie" }
        }
      }
    }
  });
  await prisma.communityPost.deleteMany({
    where: {
      author: {
        email: { contains: "@zombie" }
      }
    }
  });
  await prisma.user.deleteMany({
    where: {
      email: { contains: "@zombie" }
    }
  });

  console.log("\n📝 Generating 200 Share Your Wins posts...");
  const winsPosts: any[] = [];
  for (let i = 0; i < 200; i++) {
    winsPosts.push(generateWinsPost(i));
    if ((i + 1) % 50 === 0) {
      console.log(`  Generated ${i + 1}/200 wins posts...`);
    }
  }

  console.log("\n🎓 Generating 300 New Graduates posts...");
  const graduatesPosts: any[] = [];
  for (let i = 0; i < 300; i++) {
    graduatesPosts.push(generateGraduatesPost(i));
    if ((i + 1) % 50 === 0) {
      console.log(`  Generated ${i + 1}/300 graduates posts...`);
    }
  }

  // Create all posts with zombie users
  console.log("\n💾 Saving posts to database...");

  let created = 0;
  const allPosts = [
    ...winsPosts.map(p => ({ ...p, category: "wins" })),
    ...graduatesPosts.map(p => ({ ...p, category: "graduates" })),
  ];

  for (const postData of allPosts) {
    try {
      // Create zombie user for this post
      const zombieEmail = `zombie-${Date.now()}-${Math.random().toString(36).substr(2, 9)}@zombie.fake`;
      const zombieUser = await prisma.user.create({
        data: {
          email: zombieEmail,
          firstName: postData.authorName.first,
          lastName: postData.authorName.last,
          avatar: postData.avatar,
          role: UserRole.STUDENT,
          isFakeProfile: true,
        }
      });

      // Create the post
      const createdAt = new Date();
      createdAt.setDate(createdAt.getDate() - postData.daysAgo);

      const post = await prisma.communityPost.create({
        data: {
          title: postData.title,
          content: postData.content,
          categoryId: postData.category, // "wins" or "graduates"
          authorId: zombieUser.id,
          viewCount: postData.viewCount,
          createdAt,
        }
      });

      // Add Sarah's comment (80% chance)
      if (Math.random() < 0.8) {
        const commentTemplate = randomFrom(SARAH_COMMENTS);
        const comment = commentTemplate.replace("{name}", postData.authorName.first);

        const commentCreatedAt = new Date(createdAt);
        commentCreatedAt.setHours(commentCreatedAt.getHours() + randomInt(1, 48));

        await prisma.postComment.create({
          data: {
            content: comment,
            postId: post.id,
            authorId: sarahUser.id,
            createdAt: commentCreatedAt,
          }
        });
      }

      created++;
      if (created % 50 === 0) {
        console.log(`  Saved ${created}/${allPosts.length} posts...`);
      }
    } catch (error) {
      console.error(`Error creating post: ${error}`);
    }
  }

  console.log(`\n✅ Successfully created ${created} posts!`);
  console.log(`   - ${winsPosts.length} Share Your Wins posts`);
  console.log(`   - ${graduatesPosts.length} New Graduates posts`);
  console.log(`   - ~${Math.round(created * 0.8)} Sarah comments`);

  await prisma.$disconnect();
}

main().catch(console.error);
