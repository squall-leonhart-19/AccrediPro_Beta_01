import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// FIRST 100 - HIGH IMPACT REVIEWS
const reviews1to100 = [
  // Career transformation stories (1-20)
  { title: "Quit my nursing job and never looked back", content: "After 20 years as an ER nurse, I was exhausted and disillusioned with conventional medicine. This certification gave me the knowledge and confidence to open my own practice. Six months in, I'm earning more than my nursing salary while actually helping people heal. Best career decision ever.", rating: 5 },
  { title: "From stay-at-home mom to six-figure practitioner", content: "I started this course when my youngest entered school. Two years later, I have a thriving online practice bringing in over $12K monthly. The flexibility lets me be there for my kids while building something meaningful. This course gave me my identity back.", rating: 5 },
  { title: "Teacher to functional medicine coach in 8 months", content: "Teaching left me drained with nothing to show for it. I completed this certification while still teaching, built my client base on weekends, and resigned last spring. Now I help other burned-out professionals reclaim their health. The irony isn't lost on me.", rating: 5 },
  { title: "Corporate lawyer finds her true calling", content: "I billed 2,400 hours a year and hated every minute. This course was my escape plan. The business modules helped me transition smoothlyI replaced my legal income within 18 months. For the first time in my life, Sunday nights don't fill me with dread.", rating: 5 },
  { title: "Retired RN starts second career at 61", content: "Retirement was boring. I missed helping people but not the hospital politics. This certification let me practice medicine the way it should beactually listening to patients and addressing root causes. My little practice keeps me sharp and purposeful.", rating: 5 },
  { title: "Pharmacist sees the other side", content: "After 15 years of dispensing pills, I knew there had to be a better way. This course opened my eyes to what real healing looks like. I still consult part-time at the pharmacy, but my heart is in my functional medicine practice. The contrast is night and day.", rating: 5 },
  { title: "Fitness trainer finally gets the full picture", content: "I could get clients fit, but I couldn't solve their fatigue, brain fog, or stubborn weight. Now I can. This certification filled in all the gaps my personal training education left. My clients get better results, stay longer, and refer everyone they know.", rating: 5 },
  { title: "Massage therapist adds serious credentials", content: "Massage helped my clients feel better temporarily. Now I can help them actually get better. Adding functional medicine to my practice tripled my income and transformed my job satisfaction. I finally feel like a real healthcare provider.", rating: 5 },
  { title: "Accountant trades spreadsheets for health coaching", content: "Numbers were safe but soul-crushing. At 45, I decided life was too short. This course was thorough enough to give me real confidence despite zero health background. Two years in, I specialize in helping executives manage stress and burnout. Full circle.", rating: 5 },
  { title: "Yoga instructor goes deeper", content: "Yoga changed my life, but I wanted to help students beyond the mat. This certification gave me the clinical knowledge to address the root causes behind their struggles. Now I offer wellness retreats that combine both practices. Dream career achieved.", rating: 5 },
  { title: "HR manager becomes burnout specialist", content: "I watched talented people flame out for years. Now I help them recoverand companies prevent it in the first place. The corporate wellness space is booming, and this certification positioned me perfectly. I went from $75K salary to $180K consulting.", rating: 5 },
  { title: "Dental hygienist expands her impact", content: "Oral health is connected to everything, but dentistry ignores that. This course helped me understand the full picture. I now consult for dental practices on functional approaches and run my own gut health program. Way more fulfilling than cleaning teeth.", rating: 5 },
  { title: "Military veteran finds new mission", content: "After 22 years of service, I needed a new purpose. This certification gave me one. I specialize in helping fellow veterans with chronic pain, PTSD-related gut issues, and the transition to civilian life. It's the most meaningful work I've ever done.", rating: 5 },
  { title: "Restaurant owner pivots during pandemic", content: "COVID killed my restaurant. I used the downtime to complete this certification, and it saved me. Now I run a meal prep service combined with health coaching. Revenue already exceeds what the restaurant made, with a fraction of the stress.", rating: 5 },
  { title: "Social worker addresses root causes now", content: "I spent 12 years treating symptoms of trauma without tools to address the physical component. This course changed everything. Understanding the gut-brain connection transformed my practice. My clients finally make lasting progress.", rating: 5 },
  { title: "Chiropractor adds functional medicine protocols", content: "Adjustments only go so far. Adding functional medicine to my practice increased patient retention by 60% and revenue by 40%. The protocols integrate perfectly with chiropractic care. Wish I'd done this ten years ago.", rating: 5 },
  { title: "Failed entrepreneur finds her niche", content: "Three businesses failed before this. The difference? This certification gave me actual expertise, not just an idea. Four years later, I have a seven-figure practice helping women with autoimmune conditions. Turns out I needed to fail forward.", rating: 5 },
  { title: "Journalist writes her own success story", content: "I covered health trends for years without understanding the science. This course gave me both. Now I combine journalism with practicemy blog drives clients, and client work informs my writing. Perfect synergy.", rating: 5 },
  { title: "Flight attendant lands dream career", content: "The travel was glamorous until it wasn't. Jet lag, irregular meals, and stress destroyed my health. Fixing myself led me here. Now I specialize in helping other frequent travelers. The irony is I fly more than everfor speaking gigs.", rating: 5 },
  { title: "Burned-out therapist reclaims her purpose", content: "Talk therapy has limits. Adding functional medicine to my practice helped me address the biological factors behind depression and anxiety. My clients improve faster, and I'm no longer exhausted from carrying their pain without tools to actually help.", rating: 5 },

  // Income/ROI focused (21-40)
  { title: "Earned back tuition in first month", content: "I was nervous about the investment. Then I landed my first corporate wellness contract$4,500 for a workshop series. That was month one. This course pays for itself immediately if you actually implement what you learn.", rating: 5 },
  { title: "From $0 to $15K monthly in under a year", content: "I had no business, no clients, no following. The marketing modules in this course changed that. Eleven months later, I consistently bring in $15K with a waitlist. The business training alone is worth the investment.", rating: 5 },
  { title: "Doubled my nutrition practice income", content: "I was already a certified nutritionist earning $4K monthly. Adding functional medicine protocols let me charge premium rates and attract complex cases. Now I clear $9K monthly working fewer hours. Knowledge is literally money.", rating: 5 },
  { title: "Six figures in year two", content: "Year one was about learning and building. Year two, everything clicked. I crossed $100K with room to grow. The key was following the business modules exactlyespecially the pricing and positioning strategies.", rating: 5 },
  { title: "Best ROI of any education I've pursued", content: "I have two master's degrees that cost $80K combined and led to $50K jobs. This certification cost a fraction and helped me build a $200K practice. The ROI comparison isn't even close.", rating: 5 },
  { title: "Replaced physician income without the debt", content: "Med school would have cost $300K and a decade of my life. This certification cost under $2K and took 6 months. I now earn what many primary care doctors make without the overhead, insurance headaches, or student loans.", rating: 5 },
  { title: "Part-time practice, full-time income", content: "I see clients 20 hours a week and earn more than my husband's engineering salary. The rest of my time goes to our kids and my hobbies. This certification bought me something priceless: freedom.", rating: 5 },
  { title: "Passive income from course creation", content: "The certification taught me enough to create my own online programs. My signature course now generates $8K monthly while I sleep. Active practice plus passive products equals financial freedom.", rating: 5 },
  { title: "Charged $297 for my first consultation", content: "Before this certification, I would have charged $50 and felt guilty. The confidence I gained let me price appropriately from day one. That single mindset shift has meant thousands in additional revenue.", rating: 5 },
  { title: "Corporate contracts changed everything", content: "Individual clients are great, but corporate wellness contracts transformed my business. One Fortune 500 company pays me $5K monthly for ongoing consultation. This course taught me how to land and keep these accounts.", rating: 5 },
  { title: "From food stamps to financial freedom", content: "Five years ago, I was on government assistance. This certification was my ladder out. Today I run a thriving practice helping other single moms take control of their health and finances. The investment terrified me, but it was the only way forward.", rating: 5 },
  { title: "Paid off student loans with practice income", content: "I graduated with $45K in debt from a degree I never used. Two years of functional medicine practice income later, I'm debt-free. This certification was the best financial decision of my life.", rating: 5 },
  { title: "Insurance-free practice is liberating", content: "No insurance, no billing headaches, no waiting for reimbursements. Cash-pay practice lets me charge what I'm worth and actually help people. This course showed me how to make that model work.", rating: 5 },
  { title: "Affiliate income adds $2K monthly", content: "Beyond client work, I earn recommending the supplements and tests I use. The course covered how to do this ethically and effectively. It's not the main income, but it covers my business expenses.", rating: 5 },
  { title: "Group programs scaled my income", content: "One-on-one has limits. The course taught me to create group programs that serve more people at accessible prices while actually increasing my hourly rate. I now run quarterly cohorts that generate $20K each.", rating: 5 },
  { title: "Retirement savings finally growing", content: "At 48, I had nothing saved for retirement. Three years of practice income later, I'm maxing out my SEP-IRA and actually optimistic about the future. This certification gave me a real career, not just a job.", rating: 5 },
  { title: "Bought my first house with practice profits", content: "I never thought I'd own property. Four years after certification, I closed on a homepaid for by helping people heal. Still pinching myself.", rating: 5 },
  { title: "Speaking fees now exceed coaching income", content: "The expertise from this course positioned me as an authority. Conference speaking started as marketing but now pays $3-5K per engagement. The certification opened doors I didn't know existed.", rating: 5 },
  { title: "Multiple revenue streams from one certification", content: "Coaching, courses, speaking, affiliate marketing, book royaltiesall flowing from the expertise this certification gave me. Diversified income means I never worry about money anymore.", rating: 5 },
  { title: "Pandemic-proof income source", content: "When COVID hit, I pivoted to virtual consultations in a day. While friends lost jobs, my income actually grew. This certification gave me skills that translate across any circumstance.", rating: 5 },

  // Knowledge/Expertise focused (41-60)
  { title: "Finally understand how the body actually works", content: "Pre-med in college taught me memorization. This certification taught me systems thinking. For the first time, I understand how everything connectshormones, gut, brain, immune system. It's like finally seeing the whole picture.", rating: 5 },
  { title: "More practical than my master's in nutrition", content: "My graduate degree was theory-heavy and protocol-light. This course is the oppositeimmediately applicable clinical knowledge. I learned more useful skills here than in two years of grad school.", rating: 5 },
  { title: "Hormone module alone worth the price", content: "I struggled with hormonal issues for years. The hormone module gave me answers no doctor ever provided. I fixed myself, then started helping others. That single module transformed my health and launched my career.", rating: 5 },
  { title: "Gut health expertise sets me apart", content: "Everyone talks about gut health; few understand it deeply. This certification gave me that depth. I'm now the go-to practitioner in my area for IBS, SIBO, and autoimmune gut issues. Specialization wins.", rating: 5 },
  { title: "Lab interpretation skills are invaluable", content: "Reading labs functionally versus conventionally is a game-changer. I catch patterns doctors miss all the time. Clients come to me after being told their labs are 'normal' when they clearly aren't.", rating: 5 },
  { title: "The detox module changed my practice", content: "Detox is often dismissed as pseudoscience, but this course taught the real biochemistry. I now run evidence-based detox programs with measurable outcomes. It's my most popular offering.", rating: 5 },
  { title: "Stress-immune connection finally made sense", content: "I knew stress affected health but didn't understand the mechanisms. The psychoneuroimmunology content here is exceptional. Understanding the science makes me a more credible and effective practitioner.", rating: 5 },
  { title: "Mitochondrial health was the missing piece", content: "Chronic fatigue cases stumped me until I understood mitochondrial function. This course goes deep on cellular energy production. Now fatigue is one of my easiest cases to solve.", rating: 5 },
  { title: "Autoimmune protocols actually work", content: "The autoimmune module gave me step-by-step approaches that get results. I've helped clients reduce or eliminate medications under their doctor's supervision. Real results, not just hope.", rating: 5 },
  { title: "Thyroid expertise fills a massive gap", content: "Conventional thyroid treatment fails so many people. This course taught me why and what to do about it. My thyroid practice has a waitlist because I actually help people feel better.", rating: 5 },
  { title: "Blood sugar mastery beyond diabetes", content: "Blood sugar dysregulation underlies so many conditions. The depth of metabolic content here prepared me to help clients with weight resistance, energy crashes, mood issues, and more. Essential knowledge.", rating: 5 },
  { title: "Inflammation module connected all the dots", content: "Chronic inflammation drives most modern disease. Understanding inflammatory pathways at the level this course teaches transformed how I approach every single case. Foundational knowledge.", rating: 5 },
  { title: "Sleep science was eye-opening", content: "I knew sleep mattered; I didn't know why or how to fix it. The sleep module gave me protocols that work. Improving sleep often fixes half a client's problems without touching anything else.", rating: 5 },
  { title: "Brain health content is cutting-edge", content: "Neuroplasticity, neuroinflammation, brain-gut axisthis course covers it all. I now specialize in cognitive optimization for executives. The brain health module gave me that niche.", rating: 5 },
  { title: "Weight loss finally makes sense", content: "Calories in, calories out is so incomplete. Understanding hormonal drivers of weight transformed my approach. My weight loss clients actually keep it off because we address the real causes.", rating: 5 },
  { title: "Cardiovascular content beyond cholesterol", content: "The cardiovascular module goes way beyond LDL. Inflammation, endothelial function, metabolic healththis is how heart disease should be approached. I'm the anti-statin practitioner in my area.", rating: 5 },
  { title: "Digestive expertise from mouth to colon", content: "Most gut courses focus on the microbiome. This one covers the entire digestive tractstomach acid, enzymes, bile, motility. Complete knowledge for complete solutions.", rating: 5 },
  { title: "Women's health specialization launched", content: "PCOS, endometriosis, perimenopause, fertilitythe women's health content enabled my entire practice focus. I'm booked months out because so few practitioners understand these conditions.", rating: 5 },
  { title: "Men's health often overlooked but lucrative", content: "The men's health module opened a niche I didn't expect. Testosterone optimization, prostate health, sexual functionmen desperately need help and will pay for expertise. Unexpected goldmine.", rating: 5 },
  { title: "Pediatric protocols for my family practice", content: "Kids present differently than adults. The pediatric considerations throughout this course help me serve families safely and effectively. Parents trust me with their children because I have specific training.", rating: 5 },

  // Support/Community focused (61-75)
  { title: "The community alone is worth the investment", content: "I've learned as much from fellow students as from the curriculum. The private community is active, supportive, and full of experienced practitioners willing to share. Collaboration over competition.", rating: 5 },
  { title: "Questions answered within hours", content: "Complex case? Post it in the community. You'll have three thoughtful responses by dinner. The collective knowledge is incredible. Never felt alone in this journey.", rating: 5 },
  { title: "Mentorship I didn't expect", content: "Senior practitioners in the community took me under their wing. They've reviewed my protocols, referred overflow clients, and coached me through tough cases. This network is priceless.", rating: 5 },
  { title: "Accountability partners changed my trajectory", content: "I connected with two other students in my cohort. We meet weekly three years later, still supporting each other's practices. Those relationships alone made this worthwhile.", rating: 5 },
  { title: "Live calls are incredibly valuable", content: "The case study calls are like free continuing education forever. Real cases, real solutions, real learning. I've been out of the program for two years and still attend every call.", rating: 5 },
  { title: "Resources library keeps growing", content: "Templates, protocols, handouts, scriptsall included and constantly updated. I use something from the resource library every single day. Saved hundreds of hours I'd have spent creating my own.", rating: 5 },
  { title: "Facebook group is actually helpful", content: "Most professional Facebook groups are garbage. This one is heavily moderated and genuinely useful. Questions get expert answers, spam is removed, and drama is nonexistent.", rating: 5 },
  { title: "Referral network built my practice", content: "Practitioners refer clients they can't serve. I've received dozens of referrals from course alumni, and I send them clients too. Built-in referral network from day one.", rating: 5 },
  { title: "Guest experts exceed expectations", content: "The guest lectures from specialists are graduate-level content. Gastroenterologists, endocrinologists, functional MDsall sharing their expertise. Like having a medical school faculty available.", rating: 5 },
  { title: "Updates keep content current", content: "Nutritional science evolves. This course evolves with it. Regular updates mean my certification never goes stale. I'm always practicing with current evidence.", rating: 5 },
  { title: "International community broadens perspective", content: "Students from 40+ countries share different approaches and protocols. I've learned techniques from practitioners in Germany, Australia, and India that I never would have found otherwise.", rating: 5 },
  { title: "Emotional support during tough cases", content: "Some client cases are heartbreaking. Having a community that understands and supports you emotionallynot just clinicallymatters more than I expected. We celebrate wins and process losses together.", rating: 5 },
  { title: "Business mastermind within the community", content: "A group of us formed a business mastermind. We share marketing strategies, pricing insights, and growth tactics. This informal group has been as valuable as a formal business program.", rating: 5 },
  { title: "Lifetime access means lifetime learning", content: "I completed the course three years ago and still learn something new every week. The community, calls, and updates provide ongoing education at no additional cost.", rating: 5 },
  { title: "Found my business partner here", content: "I met my practice partner in this course. We complement each other's strengths perfectly and have built something neither could alone. Unexpected benefit with massive impact.", rating: 5 },

  // Transformation stories (76-100)
  { title: "Healed myself then started healing others", content: "Chronic fatigue, brain fog, and weight gain plagued me for a decade. Doctors had no answers. I enrolled to fix myselfand did. Now I help others escape the same trap. This course saved my life.", rating: 5 },
  { title: "Autoimmune warrior becomes autoimmune coach", content: "Lupus almost killed me. Conventional medicine managed symptoms but offered no path to thriving. What I learned here put my condition into remission and launched my career helping others do the same.", rating: 5 },
  { title: "Thyroid transformation sparked a mission", content: "Hashimoto's stole 10 years of my life. I was told it was incurable. This course taught me otherwise. I'm now symptom-free and run a thyroid-focused practice. Revenge served cold.", rating: 5 },
  { title: "Gut issues resolved, purpose found", content: "IBS controlled my life for 15 years. Three months after implementing what I learned here, I was symptom-free. That transformation made helping others with gut issues my life's work.", rating: 5 },
  { title: "From chronic illness to certified practitioner", content: "Fibromyalgia, chronic fatigue, migrainesI collected diagnoses for years. Now I collect success stories from clients I've helped. This course gave me answers doctors never could.", rating: 5 },
  { title: "Weight loss journey became a career", content: "I lost 80 pounds using functional medicine principles from this course. Maintaining that loss while helping others achieve the same is the most rewarding thing I've ever done.", rating: 5 },
  { title: "Mental health transformed through functional approach", content: "Antidepressants for 12 years barely kept me functional. Addressing root causesgut, inflammation, nutrientsgave me my brain back. I now specialize in functional approaches to mental health.", rating: 5 },
  { title: "Infertility struggles led to fertility practice", content: "Three miscarriages and countless tears. What I learned here helped me finally carry to term. My daughter is two now, and I've helped dozens of women on their fertility journeys.", rating: 5 },
  { title: "Cancer survivor finds new purpose", content: "Breast cancer at 38 forced me to examine everything. This course gave me the knowledge to support my recovery and prevent recurrence. Now I help other survivors thrive, not just survive.", rating: 5 },
  { title: "Menopause misery became menopause mastery", content: "Menopause hit me like a truck. Hot flashes, insomnia, weight gain, mood swingsthe works. This course helped me navigate it naturally. Now I guide other women through the transition.", rating: 5 },
  { title: "PCOS controlled without medication", content: "Doctors wanted to put me on metformin and birth control forever. This course taught me a better way. My PCOS is managed through diet and lifestyle, and I teach others to do the same.", rating: 5 },
  { title: "Lyme disease recovery inspired specialization", content: "Chronic Lyme destroyed five years of my life. The functional approach outlined here restored my health when nothing else worked. I now specialize in complex chronic infections.", rating: 5 },
  { title: "Mold illness awakened my calling", content: "Unexplained illness for years turned out to be mold toxicity. This course helped me understand and address it. I've since become a mold illness specialist helping others escape toxic environments.", rating: 5 },
  { title: "Migraine freedom after 20 years", content: "Weekly migraines for two decades. Every medication, every specialist, no relief. The root cause approach here eliminated them completely. I haven't had a migraine in three years.", rating: 5 },
  { title: "Anxiety resolved without medication", content: "Benzos were ruining my life but I couldn't function without them. This course taught me the underlying physiology and how to address it. Medication-free for two years and thriving.", rating: 5 },
  { title: "Eczema gone after lifetime of suffering", content: "I had eczema since infancy. Steroid creams were my constant companion. Understanding the gut-skin connection changed everything. Clear skin at 40 felt like a miracle.", rating: 5 },
  { title: "Chronic pain practitioner heals herself first", content: "Fibromyalgia pain made every day a struggle. What I learned here reduced my pain by 80%. Now I specialize in helping chronic pain patients actually improve, not just cope.", rating: 5 },
  { title: "Blood sugar normalized without medication", content: "Pre-diabetic and terrified. My doctor wanted me on metformin. Six months of implementing this course's protocols, and my A1C is normal. Knowledge is powerful medicine.", rating: 5 },
  { title: "Energy restored after decade of fatigue", content: "Chronic fatigue made me a zombie for ten years. Adrenal support, mitochondrial nutrition, and addressing hidden infections gave me my life back. I'm more energetic at 50 than I was at 30.", rating: 5 },
  { title: "Brain fog finally lifted", content: "I thought cognitive decline was inevitable as I aged. This course taught me otherwise. My focus and memory are sharper than they've been in decades. Now I help others clear the fog.", rating: 5 },
  { title: "Insomnia conquered after 15 years", content: "Sleep medications stopped working years ago. The sleep protocols in this course actually addressed why I couldn't sleep. Seven hours a night now, naturally. Life-changing.", rating: 5 },
  { title: "Digestive issues resolved, passion ignited", content: "Bloating, constipation, and pain after every meal for years. This course taught me exactly what was wrong and how to fix it. Perfect digestion now, and a thriving gut health practice.", rating: 5 },
  { title: "Hormone balance achieved naturally", content: "PMS from hell, irregular cycles, and mood swings that strained my marriage. Balanced hormones changed everythingmy health, my relationships, my career. I'm a completely different person.", rating: 5 },
  { title: "Reversed autoimmune markers", content: "Elevated ANA had me terrified of developing lupus like my mother. This course taught me how to calm my immune system. Three years later, my markers are normal and I'm helping others achieve the same.", rating: 5 },
  { title: "From patient to practitioner", content: "I was the patient who stumped doctors for years. Now I'm the practitioner who helps the patients doctors can't figure out. Full circle transformation that this course made possible.", rating: 5 },
];

// Reviews 101-200
const reviews101to200 = [
  { title: "Perfect for busy professionals", content: "I completed this course while working full-time and raising two kids. The self-paced format and well-organized modules made it manageable. No excuse not to invest in yourself.", rating: 5 },
  { title: "Exactly what conventional medicine misses", content: "After years in healthcare, I saw what was missing. This course fills that gap with practical, evidence-based approaches that actually help people. Should be required for all healthcare providers.", rating: 5 },
  { title: "Better than the expensive programs", content: "I almost enrolled in a $20K functional medicine program. So glad I found this first. More comprehensive, more practical, and a fraction of the cost. Smart investment.", rating: 5 },
  { title: "Structured yet flexible learning", content: "The course is beautifully structuredeach module builds on the last. But the flexibility to learn at your own pace made it realistic for my busy life. Perfect balance.", rating: 5 },
  { title: "Clinical protocols I use every day", content: "Some courses are theory-heavy with no practical application. This one gives you exact protocols to implement immediately. I reference the materials weekly with clients.", rating: 5 },
  { title: "Gave me confidence to charge premium rates", content: "The depth of knowledge here positions you as an expert. I confidently charge $300 per session because I know I'm worth it. That confidence came directly from this education.", rating: 5 },
  { title: "Wish I found this ten years ago", content: "I spent a decade piecing together information from books, podcasts, and seminars. This course has it all in one place, organized and comprehensive. Would have saved years of searching.", rating: 5 },
  { title: "My clients notice the difference", content: "Since completing this certification, my client outcomes have dramatically improved. They notice. They refer. My practice grows itself now through word of mouth.", rating: 5 },
  { title: "Comprehensive without being overwhelming", content: "The amount of content could be overwhelming, but it's presented so clearly that it never felt that way. Excellent instructional design combined with deep knowledge.", rating: 5 },
  { title: "Legitimate credential that impresses", content: "When I tell potential clients about this certification, it establishes instant credibility. The curriculum is respected enough that it opens doors other credentials don't.", rating: 5 },
  { title: "Changed how I see health forever", content: "You can't unlearn what this course teaches. It fundamentally changed my understanding of the human body. I'll never look at symptoms the same way again.", rating: 5 },
  { title: "Case studies brought learning to life", content: "Real-world case studies made abstract concepts concrete. I felt like I was already working with clients while still learning. That hands-on approach accelerated my confidence.", rating: 5 },
  { title: "Video quality exceeded expectations", content: "The production quality is excellentclear audio, professional visuals, and engaging presentation. Made long study sessions enjoyable rather than tedious.", rating: 5 },
  { title: "Worth more than my bachelor's degree", content: "Four years and $60K for a degree I never used. A few months and a fraction of the cost for skills I use daily to help people and earn a living. No comparison.", rating: 5 },
  { title: "Practical from day one", content: "I started implementing what I learned immediatelyfirst with myself, then with family, then with clients. No waiting until graduation to make an impact.", rating: 5 },
  { title: "Fills gaps my nursing education left", content: "Nursing school taught me how to follow protocols. This course taught me how to think functionally. The combination makes me a better nurse and a successful practitioner.", rating: 5 },
  { title: "Integrative approach makes sense", content: "Neither purely conventional nor purely alternative. The integrative approach here is balanced and evidence-based. It's how medicine should be practiced everywhere.", rating: 5 },
  { title: "Opened doors I didn't know existed", content: "This certification led to speaking engagements, podcast appearances, and collaboration opportunities I never imagined. The credential signals expertise that attracts opportunities.", rating: 5 },
  { title: "My family thanks me for taking this course", content: "I've helped my parents manage chronic conditions, supported my sister through fertility struggles, and optimized my kids' health. The knowledge serves everyone I love.", rating: 5 },
  { title: "Perfect stepping stone to advanced training", content: "This certification was my foundation. I've since pursued specialized training in areas like mold illness and SIBO. This course prepared me perfectly for advanced education.", rating: 5 },
  { title: "Mobile-friendly format for learning anywhere", content: "I completed half this course on my phone during commutes and lunch breaks. The platform works perfectly on mobile. Learning fit into pockets of time I didn't know I had.", rating: 5 },
  { title: "Downloadable resources are goldmine", content: "The PDFs, templates, and handouts alone would be worth significant money. Having them all included and customizable saved me countless hours of content creation.", rating: 5 },
  { title: "Finally feel like a real professional", content: "Before this certification, imposter syndrome was constant. Now I have the knowledge and credentials to match my passion. I feel like a legitimate healthcare provider.", rating: 5 },
  { title: "Business modules surprisingly excellent", content: "I expected great health content. I didn't expect such comprehensive business training. Pricing, marketing, client acquisitionit's all here. Complete practice-building education.", rating: 5 },
  { title: "My doctor was impressed", content: "I shared some of what I learned with my own physician. He was genuinely impressed and now asks me questions about functional approaches. That felt validating.", rating: 5 },
  { title: "Learning community is genuinely helpful", content: "The student community isn't just activeit's genuinely supportive. Questions get thoughtful answers, not judgment. A safe space to learn and grow.", rating: 5 },
  { title: "Certificate looks professional", content: "Small thing, but the certificate is beautiful and well-designed. It's framed in my office and clients notice. Attention to detail throughout the program.", rating: 5 },
  { title: "Quizzes reinforced learning effectively", content: "The quizzes after each module ensured I actually retained information. They were challenging enough to require attention but not discouraging. Effective learning design.", rating: 5 },
  { title: "Made functional medicine accessible", content: "Functional medicine can seem complicated and exclusive. This course made it accessible without dumbing it down. Complex concepts explained clearly.", rating: 5 },
  { title: "Investment in myself finally paid off", content: "I've wasted money on courses that delivered nothing. This one paid for itself within months. Smart investment that keeps compounding.", rating: 5 },
  { title: "Exactly what the wellness industry needs", content: "So much misinformation in wellness. This course is rigorously evidence-based while still acknowledging what conventional medicine misses. The balance is perfect.", rating: 5 },
  { title: "Helped me find my niche", content: "I didn't know what I wanted to specialize in when I started. The breadth of content helped me discover my passion for hormone health. Now I have a focused, thriving niche.", rating: 5 },
  { title: "Client retention dramatically improved", content: "Before this course, clients would come for a few sessions and disappear. Now they stay for months, achieve results, and refer others. My retention rate tripled.", rating: 5 },
  { title: "No fluff or filler content", content: "Every module, every lesson, every minute has value. No padding to make the course seem more substantial. Respect for students' time is evident throughout.", rating: 5 },
  { title: "Made me a better listener", content: "Understanding root causes requires careful history-taking. This course taught me how to listen to clients in a way that reveals what's really going on. Invaluable skill.", rating: 5 },
  { title: "Scientific references give credibility", content: "Every claim is backed by research. Having citations to share with skeptical clients or physicians establishes credibility. Science-backed practice.", rating: 5 },
  { title: "Protocol customization taught well", content: "One-size-fits-all doesn't work in health. This course teaches how to customize protocols for individual clients. That personalization skill is what sets great practitioners apart.", rating: 5 },
  { title: "Scope of practice guidance appreciated", content: "The course clearly explains what's within scope and when to refer. This clarity protects both practitioners and clients. Responsible education.", rating: 5 },
  { title: "Worth every hour invested", content: "Time is my most precious resource. This course respected it by delivering dense, valuable content efficiently. Every hour of study returned value.", rating: 5 },
  { title: "Changed my family's health trajectory", content: "My kids will grow up understanding real health because of what I learned here. Breaking generational patterns of chronic disease starts with education like this.", rating: 5 },
  { title: "Better outcomes than my previous training", content: "I had multiple wellness certifications before this. None came close to producing the client outcomes this knowledge enables. Quality over quantity of credentials.", rating: 5 },
  { title: "Perfect pace of information delivery", content: "Not too fast to overwhelm, not too slow to bore. The pacing of content delivery felt carefully calibrated. Easy to stay engaged throughout.", rating: 5 },
  { title: "Supplement guidance is practical", content: "Knowing which supplements actually help and how to dose them properly is crucial. This course cuts through supplement confusion with practical, evidence-based guidance.", rating: 5 },
  { title: "Insurance not needed for thriving practice", content: "Cash-pay practice seemed impossible until this course. The business training showed me how to build a thriving practice without insurance dependence. Freedom.", rating: 5 },
  { title: "Continuing education I actually wanted", content: "Required CEUs often feel like a waste. This course is continuing education I would have chosen regardless. Learned more than mandatory coursework ever taught.", rating: 5 },
  { title: "My practice finally feels complete", content: "Something was always missing in my health coaching practice. This certification filled that gap. I finally feel equipped to help clients with complex issues.", rating: 5 },
  { title: "Taught me to think like a detective", content: "Health is a puzzle. This course taught me how to gather clues, connect patterns, and find root causes. That detective mindset transformed my practice.", rating: 5 },
  { title: "Recording access means lifetime review", content: "I've rewatched certain modules multiple times as I encountered relevant client cases. Lifetime access to recordings means continuous learning and reference.", rating: 5 },
  { title: "Clear path from student to practitioner", content: "Some courses leave you wondering what to do after. This one provides a clear roadmap from learning to launching. No ambiguity about next steps.", rating: 5 },
  { title: "My most recommended resource", content: "When people ask how I learned functional medicine, I send them here without hesitation. My most confidently recommended resource for aspiring practitioners.", rating: 5 },
  { title: "Transformed skeptic into believer", content: "I enrolled skeptical that online education could deliver real expertise. I emerged a believer. The depth and quality exceeded any online course I've taken.", rating: 5 },
  { title: "Dietary guidance is nuanced and practical", content: "Not just 'eat clean'actual biochemistry of how foods affect systems. The dietary modules give nuanced guidance I apply with every client.", rating: 5 },
  { title: "Testing recommendations saved me thousands", content: "The course teaches which functional tests are actually worth ordering. This guidance prevented me from wasting money on unnecessary testing for clients.", rating: 5 },
  { title: "Ethical marketing taught properly", content: "Marketing in wellness can feel sleazy. This course teaches ethical marketing that attracts ideal clients without compromising integrity. Refreshing approach.", rating: 5 },
  { title: "More than a coursea career transformation", content: "I didn't just take a course. I transformed my career, my health, and my purpose. The ripple effects continue years later.", rating: 5 },
  { title: "Complex conditions made manageable", content: "Autoimmune, hormonal, metabolicconditions that seemed impossibly complex are now manageable with the frameworks this course provides. Confidence with complexity.", rating: 5 },
  { title: "Worth recommending to colleagues", content: "I've sent several healthcare colleagues to this course. Their feedback confirms my experienceit's exceptional training that any health professional would benefit from.", rating: 5 },
  { title: "Perfect complement to existing credentials", content: "My other certifications gave me pieces. This one completed the puzzle. The functional medicine lens integrates and enhances everything else I've learned.", rating: 5 },
  { title: "Made me the go-to in my community", content: "Word spread that I could actually help where others couldn't. I'm now the go-to practitioner in my community for complex cases. This course built that reputation.", rating: 5 },
  { title: "Truly comprehensive curriculum", content: "I kept waiting for gaps or areas they'd skim over. They never came. Every system, every condition, every protocol covered thoroughly. Truly comprehensive.", rating: 5 },
  { title: "Teaching style resonates perfectly", content: "The instructors explain complex concepts in accessible language without oversimplifying. That balance is rare and makes learning enjoyable.", rating: 5 },
  { title: "Gave me language to explain root causes", content: "I intuitively knew things were connected but couldn't articulate it. This course gave me precise language to explain root causes to clients. Communication transformed.", rating: 5 },
  { title: "Lab work interpretation is next level", content: "Reading labs functionally versus conventionally is like learning a new language. This course taught me that language fluently. My lab analysis is now a key service.", rating: 5 },
  { title: "Chronic disease prevention expertise", content: "Most healthcare is reactive. This course taught preventionidentifying trajectory toward disease before diagnosis. Truly valuable expertise.", rating: 5 },
  { title: "Mind-body connection properly explained", content: "The mind-body connection is often mentioned vaguely. This course explains the actual mechanismsHPA axis, vagal tone, psychoneuroimmunology. Science, not woo.", rating: 5 },
  { title: "Group coaching framework included", content: "One-on-one has limits. The group coaching training helped me scale my impact and income while serving more people accessibly. Important business skill.", rating: 5 },
  { title: "Red flags and referral patterns taught", content: "Knowing when something is beyond your scope is crucial. This course teaches red flags and when to refer clearly. Safe, responsible practice.", rating: 5 },
  { title: "Nutrition beyond macros", content: "Macros are just the beginning. Micronutrients, phytonutrients, nutrient timing, individual variationthis course goes deep on nutrition science.", rating: 5 },
  { title: "Exercise prescription made simple", content: "Movement is medicine, but dosing matters. The exercise modules teach how to prescribe movement appropriately for different conditions. Underrated skill.", rating: 5 },
  { title: "Environmental health awareness critical", content: "Toxins, mold, EMFsenvironmental factors affecting health are often ignored. This course covers environmental medicine thoroughly. Increasingly important knowledge.", rating: 5 },
  { title: "Aging optimization protocols valuable", content: "Longevity science is exploding. The healthy aging content positions me to serve the growing market of people wanting to optimize their later years.", rating: 5 },
  { title: "Sports nutrition beyond basics", content: "Athletes have unique needs. The sports nutrition content helps me serve this high-paying niche effectively. Specialized knowledge attracts premium clients.", rating: 5 },
  { title: "Pediatric considerations appropriate", content: "Working with kids requires different approaches. The pediatric content taught me how to modify protocols safely for younger clients.", rating: 5 },
  { title: "Geriatric protocols practical", content: "Elderly clients have unique considerations. The geriatric content helps me serve this growing population safely and effectively.", rating: 5 },
  { title: "Pregnancy and postpartum guidance solid", content: "Supporting women through pregnancy and postpartum requires specific knowledge. This course provides safe, evidence-based guidance for this sensitive time.", rating: 5 },
  { title: "Practitioner self-care emphasized", content: "Burnout is real in healthcare. The emphasis on practitioner wellness throughout the course helps me maintain my own health while helping others.", rating: 5 },
  { title: "Documentation templates save hours", content: "Proper documentation protects you legally and serves clients better. The included templates saved me countless hours of administrative work.", rating: 5 },
  { title: "Intake process thoroughly covered", content: "A good intake is half the battle. This course teaches comprehensive intake processes that reveal root causes efficiently. Foundation of effective practice.", rating: 5 },
  { title: "Follow-up protocols structured well", content: "Initial consults are one thing; effective follow-up is another. The follow-up structures taught here keep clients progressing and retained.", rating: 5 },
  { title: "Difficult conversations navigation", content: "Sometimes you have to deliver hard truths. The communication training helped me navigate difficult conversations with clients effectively.", rating: 5 },
  { title: "Marketing without feeling salesy", content: "I hated the idea of marketing myself. This course reframed marketing as education and service. Now I market confidently without feeling gross.", rating: 5 },
  { title: "Pricing psychology helpful", content: "Undercharging is epidemic in wellness. The pricing psychology content helped me value my expertise appropriately. Made a huge income difference.", rating: 5 },
  { title: "Client acquisition systems work", content: "The client acquisition systems actually work. I implemented them step-by-step and built a full practice. No guessing, just following proven systems.", rating: 5 },
  { title: "Retention strategies effective", content: "Getting clients is one thing; keeping them is another. The retention strategies helped me build long-term relationships that sustain my practice.", rating: 5 },
  { title: "Tech recommendations practical", content: "What platforms, tools, and systems to use? This course gives practical tech recommendations that saved me from expensive trial and error.", rating: 5 },
  { title: "Legal considerations addressed", content: "Scope of practice, liability, documentationthe legal guidance gave me confidence to practice safely. Important foundation often overlooked.", rating: 5 },
  { title: "Ethics framework appreciated", content: "The ethical framework taught here guides my decision-making with clients. Important foundation for building trust and practicing responsibly.", rating: 5 },
  { title: "Virtual practice setup complete", content: "The virtual practice training was perfect for pandemic times and beyond. I've served clients across the country without leaving my home office.", rating: 5 },
  { title: "Local practice building covered too", content: "For those wanting in-person practice, the local marketing strategies are excellent. Built a local reputation using these approaches.", rating: 5 },
  { title: "Niche selection guidance valuable", content: "Choosing a niche was paralyzing until this course. The niche selection framework helped me find my focus. Specialization made my marketing easier.", rating: 5 },
  { title: "Program creation training excellent", content: "Creating signature programs seemed mysterious. The program creation training demystified it. I now have a scalable offering that works.", rating: 5 },
  { title: "Excellent value for comprehensive content", content: "Comparing content depth to price, this is exceptional value. Similar information elsewhere costs five to ten times more. Smart investment.", rating: 5 },
  { title: "Updates keep certification current", content: "Nutrition science evolves. Regular course updates mean my certification stays relevant. Not a one-time purchase but ongoing education.", rating: 5 },
  { title: "Meets high educational standards", content: "The educational rigor here meets or exceeds traditional health programs. I feel genuinely well-trained, not just certificate-holding.", rating: 5 },
  { title: "Perfect blend of art and science", content: "Health practice is both art and science. This course honors bothteaching the science while developing the intuition for practice.", rating: 5 },
  { title: "Exactly what I was searching for", content: "I searched for years for training that was comprehensive, practical, and affordable. This was exactly what I'd been looking for.", rating: 5 },
  { title: "Exceeded every expectation", content: "I had modest expectations for an online course. Every single one was exceeded. Quality, depth, support, valueall better than anticipated.", rating: 5 },
];

// Reviews 201-300
const reviews201to300 = [
  { title: "Solid foundation for health practice", content: "This course built the foundation my practice stands on. Every protocol I use traces back to what I learned here. Rock-solid education.", rating: 5 },
  { title: "Real clinical skills developed", content: "Not just theoryactual clinical skills. Case analysis, protocol development, client communication. Ready to practice after completing this.", rating: 5 },
  { title: "Helped more people than my pharmacy career", content: "In two years of functional medicine practice, I've helped more people truly improve than in a decade of pharmacy. This course enabled that.", rating: 5 },
  { title: "Perfect for career changers", content: "Changing careers in your 40s is scary. This course made it doable. Clear path, practical skills, supportive community. Career change achieved.", rating: 5 },
  { title: "Kids healthier thanks to this course", content: "My children will never struggle the way I did with health because of what I learned here. Breaking cycles one generation at a time.", rating: 5 },
  { title: "Community physician refers to me now", content: "Local doctors refer their complex patients to me. The credibility this certification provides opened that door. Meaningful professional respect.", rating: 5 },
  { title: "Finally making a difference", content: "Corporate job paid well but felt meaningless. Now I make a real difference daily. This course gave me that opportunity.", rating: 5 },
  { title: "Saved my marriage honestly", content: "My chronic health issues were straining my relationship. Fixing my health fixed my marriage. This course taught me how.", rating: 5 },
  { title: "Worth taking time off work", content: "I took a sabbatical to complete this intensively. Best career decision ever. Came back to work transformed, then left to practice.", rating: 5 },
  { title: "Supplement store clerk to practitioner", content: "I worked at a supplement store for years. Now I have my own practice. This course was the bridge between retail and professional.", rating: 5 },
  { title: "Cooking skills improved significantly", content: "The nutrition modules improved my cooking dramatically. I can make therapeutic foods taste amazing now. Practical life skill bonus.", rating: 5 },
  { title: "Sleep better now understanding circadian biology", content: "The sleep content changed my own sleep habits. Understanding circadian biology optimized my rest. Personal transformation alongside professional growth.", rating: 5 },
  { title: "My energy levels finally stable", content: "Personal benefit: my own energy is stable all day now. Implementing what I learned on myself was the first step. Now I help others achieve the same.", rating: 5 },
  { title: "Anxiety management skills invaluable", content: "The nervous system content helped my own anxiety tremendously. Now I help anxious clients find calm. Personal and professional transformation.", rating: 5 },
  { title: "Weight maintenance effortless now", content: "Lost weight many times before, always regained. Understanding metabolic function through this course made maintenance effortless finally.", rating: 5 },
  { title: "Skin cleared up completely", content: "Lifelong acne finally resolved once I understood the gut-skin axis. Personal success story I now share with clients. Proof the knowledge works.", rating: 5 },
  { title: "Joint pain resolved without surgery", content: "Doctor recommended knee surgery. Implemented anti-inflammatory protocols from this course instead. Pain gone without going under the knife.", rating: 5 },
  { title: "Blood pressure normalized naturally", content: "Was heading toward hypertension medication. This course taught me why and how to fix it naturally. Normal blood pressure now, no meds.", rating: 5 },
  { title: "Cholesterol improved without statins", content: "Doctor wanted me on statins. Applied this course's cardiovascular protocols instead. Numbers improved, doctor impressed, no medication needed.", rating: 5 },
  { title: "Digestion perfect after years of issues", content: "Bloating and discomfort after every meal for years. Now I eat without consequence. Personal transformation that informs my practice.", rating: 5 },
  { title: "Cleared brain fog that plagued me", content: "Couldn't think clearly for years. Implementing what I learned restored my cognitive function. Personal experience makes me credible with clients.", rating: 5 },
  { title: "Finally sleeping through the night", content: "Insomnia for a decade. Sleep protocols from this course actually worked. Seven hours solid now. Life-changing personal benefit.", rating: 5 },
  { title: "Hormone symptoms eliminated", content: "PMS was debilitating. Hormone protocols from this course eliminated it. Now I help other women find the same relief.", rating: 5 },
  { title: "Chronic headaches disappeared", content: "Weekly headaches for years. Haven't had one in over a year since implementing what I learned. Personal proof that knowledge is power.", rating: 5 },
  { title: "Immune function noticeably stronger", content: "Used to catch every bug. Haven't been sick in two years. Immune protocols from this course actually work.", rating: 5 },
  { title: "Stress resilience dramatically improved", content: "Used to crumble under stress. HPA axis protocols rebuilt my resilience. Calm under pressure now. Professional and personal benefit.", rating: 5 },
  { title: "Exercise recovery faster than ever", content: "Applied sports nutrition and recovery protocols to my own training. Recovering faster than in my twenties at forty. Personal validation.", rating: 5 },
  { title: "Allergies significantly reduced", content: "Seasonal allergies were miserable. Understanding immune modulation reduced symptoms by 80%. No antihistamines needed now.", rating: 5 },
  { title: "Focus improved for long work sessions", content: "Couldn't focus for more than 30 minutes. Brain nutrition protocols extended that to hours. Personal benefit enabling better service to clients.", rating: 5 },
  { title: "Family health transformed completely", content: "Applied what I learned to my whole family. Everyone healthier, happier, more energetic. Ripple effects beyond my practice.", rating: 5 },
  { title: "Aging parents doing better", content: "Helped my elderly parents optimize their health. They're more active and independent now. This knowledge serves generations.", rating: 5 },
  { title: "Spouse's chronic issues resolved", content: "My wife suffered for years with fatigue. What I learned here helped her recover. Saved money on doctors, more importantly restored her life.", rating: 5 },
  { title: "Children rarely sick anymore", content: "My kids used to catch everything. Implementing what I learned about pediatric immune function changed that. Healthier kids, happier family.", rating: 5 },
  { title: "Pet health even improved", content: "Functional principles apply to animals too. My dog is healthier from what I've learned. Unexpected benefit of this knowledge.", rating: 5 },
  { title: "Friends constantly asking for advice", content: "Everyone in my life asks for health advice now. This course made me the knowledgeable friend everyone needs. Social proof of expertise.", rating: 5 },
  { title: "Coworkers noticed my transformation", content: "Colleagues watched me transform while taking this course. Several enrolled themselves after seeing my results. Living proof works.", rating: 5 },
  { title: "Doctor asking me questions now", content: "My own physician now asks what I'm doing. When I explain, he's genuinely interested. The student becomes the resource.", rating: 5 },
  { title: "More energy for what matters", content: "Not just working energyenergy for life. Playing with kids, pursuing hobbies, enjoying evenings. This course gave me life back.", rating: 5 },
  { title: "Mental clarity for complex problems", content: "Brain function so much better I'm solving problems I couldn't before. Professional performance improved alongside health.", rating: 5 },
  { title: "Confidence in social situations", content: "Health struggles made me withdrawn. Improved health restored my confidence. This course enabled personal transformation beyond practice.", rating: 5 },
  { title: "Better relationships from better health", content: "Chronic illness strains relationships. Recovery restored connections. Personal healing enabled by this education.", rating: 5 },
  { title: "Travel without health worries now", content: "Used to dread travel because of health issues. Now I explore freely. The protocols travel with me.", rating: 5 },
  { title: "Restaurant dining less stressful", content: "Understanding my triggers means I can eat out without anxiety. Knowledge brings freedom, not restriction.", rating: 5 },
  { title: "Work performance improved significantly", content: "Better health means better work. Got promoted before I even started my practice. This course improved my life immediately.", rating: 5 },
  { title: "Productivity through the roof", content: "Clear head and stable energy mean productive days. Output doubled while effort decreased. Personal ROI before practice even started.", rating: 5 },
  { title: "Creative work flowing again", content: "Brain fog blocked creativity for years. Clear cognition restored my creative output. Personal benefit that enriches life.", rating: 5 },
  { title: "Exercise feels good again", content: "Used to dread workouts. Now I genuinely enjoy movement. Recovery protocols made exercise a pleasure.", rating: 5 },
  { title: "Food relationship completely healed", content: "Years of disordered eating patterns resolved. Understanding physiology healed my food relationship. Personal healing before professional helping.", rating: 5 },
  { title: "Body image dramatically improved", content: "Health knowledge replaced body criticism with body understanding. Personal transformation enabled confident helping of others.", rating: 5 },
  { title: "Finally feel like myself again", content: "Lost myself to chronic illness for years. This course helped me find me again. Personal reclamation of identity.", rating: 5 },
  { title: "Morning person for the first time", content: "Never a morning person until fixing my circadian biology. Now I'm up early feeling great. Life-changing personal shift.", rating: 5 },
  { title: "Evening energy for family time", content: "Used to be exhausted by 5pm. Now I have energy for family evenings. Quality of life transformation.", rating: 5 },
  { title: "Weekend adventures possible again", content: "Fatigue stole weekends for years. Now I hike, travel, and explore. This course gave me my weekends back.", rating: 5 },
  { title: "Hobby time restored", content: "Too tired for hobbies for years. Energy restoration brought them back. Complete life improvement beyond professional growth.", rating: 5 },
  { title: "Reading comprehension returned", content: "Brain fog made reading impossible. Clear cognition restored my love of books. Personal joy from professional education.", rating: 5 },
  { title: "Memory sharp as ever", content: "Worried about cognitive decline at 45. Memory better now than in my thirties. This knowledge protects brain health.", rating: 5 },
  { title: "Emotional regulation improved", content: "Used to be reactive and volatile. Stable blood sugar and hormones stabilized emotions. Personal growth through health optimization.", rating: 5 },
  { title: "Patience with kids returned", content: "Short temper from exhaustion and inflammation. Calm parent now that I've addressed root causes. Family benefit from personal transformation.", rating: 5 },
  { title: "Partner relationship deepened", content: "Better health means better partnership. More present, more patient, more connected. Personal relationships enriched by this education.", rating: 5 },
  { title: "Social life revived", content: "Too tired for friends for years. Energy restoration brought my social life back. Complete quality of life improvement.", rating: 5 },
  { title: "Optimism restored naturally", content: "Chronic inflammation drove depression. Addressing root causes restored optimism. Personal healing from professional knowledge.", rating: 5 },
  { title: "Future feels bright again", content: "Chronic illness made the future look grim. Recovery restored hope. This course changed my outlook on life.", rating: 5 },
  { title: "Took control of my health destiny", content: "No longer passive patient hoping doctors figure it out. Active participant in my health. Empowerment through education.", rating: 5 },
  { title: "Understanding removes fear", content: "Health anxiety plagued me until I understood my body. Knowledge replaced fear with confidence. Personal transformation.", rating: 5 },
  { title: "Symptoms no longer mysterious", content: "Every symptom used to trigger panic. Now I understand what they mean and what to do. Peace of mind from knowledge.", rating: 5 },
  { title: "Diet no longer confusing", content: "Tried every diet, confused by conflicting advice. This course clarified what actually matters. Confidence in food choices.", rating: 5 },
  { title: "Supplement protocol simplified", content: "Overwhelmed by supplement options before. Now I know exactly what I need and why. Clarity from education.", rating: 5 },
  { title: "Sleep hygiene actually working", content: "Read about sleep tips everywhere but nothing worked until I understood the physiology. Now sleep hygiene actually helps.", rating: 5 },
  { title: "Exercise programming makes sense", content: "Finally understand how to exercise for my body. Not more, but smarter. Personal fitness transformed.", rating: 5 },
  { title: "Stress management actually effective", content: "Generic stress tips never helped. Understanding HPA axis made stress management actually effective. Personal resilience built.", rating: 5 },
  { title: "Recovery protocols game-changing", content: "Whether from workouts or illness, I know how to recover now. Personal benefit that translates to client help.", rating: 5 },
  { title: "Seasonal transitions smooth now", content: "Used to struggle with every season change. Now I adapt smoothly. Knowledge prevents suffering.", rating: 5 },
  { title: "Holiday eating managed easily", content: "Holidays used to wreck my health. Now I navigate them skillfully. Practical life skills beyond practice.", rating: 5 },
  { title: "Travel health protocols invaluable", content: "International travel used to devastate my health. Protocols from this course keep me well. Practical personal benefit.", rating: 5 },
  { title: "Work travel no longer draining", content: "Business travel used to exhaust me. Recovery protocols keep me functional. Professional and personal performance improved.", rating: 5 },
  { title: "Conference season manageable", content: "Conference attendance used to require recovery days. Now I thrive. Knowledge enables performance.", rating: 5 },
  { title: "Busy seasons sustainable", content: "Work busy seasons used to crash my health. Now I maintain through stress. Resilience through knowledge.", rating: 5 },
  { title: "Family gatherings enjoyable again", content: "Used to dread family events due to food stress. Now I navigate easily. Personal peace at gatherings.", rating: 5 },
  { title: "Wedding season success", content: "Every wedding used to mean days of recovery. Now I enjoy celebrations. Social life restored.", rating: 5 },
  { title: "Vacation truly relaxing now", content: "Vacations used to make me sick. Now they actually restore me. Personal benefit from travel health knowledge.", rating: 5 },
  { title: "Pregnancy preparation guided", content: "Planning pregnancy and now I know how to optimize. This course guides my preparation. Personal application of knowledge.", rating: 5 },
  { title: "Postpartum recovery planned", content: "Having protocols ready for postpartum recovery feels empowering. Personal benefit beyond professional application.", rating: 5 },
  { title: "Perimenopause navigation smoother", content: "Entering perimenopause with knowledge instead of fear. This course prepared me personally while training me professionally.", rating: 5 },
  { title: "Aging with confidence", content: "No longer fearing getting older because I know how to age well. Knowledge replaces anxiety. Personal peace.", rating: 5 },
  { title: "Menopause not scary anymore", content: "Watched my mother suffer through menopause. Won't be my experience thanks to what I learned. Personal preparation.", rating: 5 },
  { title: "Andropause understanding helpful", content: "As a man, understanding hormonal changes through life helps me navigate aging well. Personal benefit from comprehensive education.", rating: 5 },
  { title: "Parents' end-of-life support improved", content: "Knowledge helps me support aging parents better. Practical application of geriatric content beyond practice.", rating: 5 },
  { title: "Caregiver burnout prevented", content: "Caring for ill family member could have destroyed my health. Knowledge protected me. Personal benefit during hard times.", rating: 5 },
  { title: "Grief recovery supported physically", content: "Understood how grief affects the body physically. Supported myself through loss better because of this knowledge.", rating: 5 },
  { title: "Trauma recovery understanding deeper", content: "Personal trauma recovery enhanced by understanding somatic components. Healing personally while learning professionally.", rating: 5 },
  { title: "Addiction recovery supported", content: "Understanding neurotransmitter balance supported my recovery. Personal healing through professional knowledge.", rating: 5 },
  { title: "Eating disorder recovery informed", content: "This course deepened understanding of my ED recovery. Not treatment, but complementary knowledge. Personal benefit.", rating: 5 },
  { title: "Anxiety disorder management improved", content: "Clinical anxiety managed better with functional knowledge. Personal application alongside professional medication.", rating: 5 },
  { title: "Depression recovery supported", content: "Functional knowledge supported my clinical depression treatment. Personal benefit beyond professional practice.", rating: 5 },
  { title: "ADHD management enhanced", content: "Understanding brain function improved my ADHD management. Personal benefit from neurological content.", rating: 5 },
  { title: "Autoimmune condition stabilized", content: "My own autoimmune condition more stable applying this knowledge. Personal experience informing professional practice.", rating: 5 },
  { title: "Chronic pain better managed", content: "Living with chronic pain, this course improved my management. Personal suffering reduced through knowledge.", rating: 5 },
  { title: "IBS symptoms controlled", content: "My IBS dramatically improved with gut protocols. Personal success story I share with clients.", rating: 5 },
  { title: "GERD resolved without medication", content: "Daily antacids for years. Resolved through understanding true causes. Personal freedom from medication.", rating: 5 },
];

// Reviews 301-390
const reviews301to390 = [
  { title: "Quality content throughout", content: "No filler, no fluffjust solid, applicable content from start to finish. Respect for students' time and investment evident.", rating: 5 },
  { title: "Structured for busy people", content: "Modules organized perfectly for learning in chunks. Completed while working full-time. Accessible education.", rating: 5 },
  { title: "Progressive difficulty well-designed", content: "Builds from foundations to advanced concepts perfectly. Never felt lost or bored. Expert instructional design.", rating: 5 },
  { title: "Review materials helpful", content: "Summaries and key points at each module end reinforced learning. Retention improved through good design.", rating: 5 },
  { title: "Real-world examples clarify concepts", content: "Abstract ideas made concrete through clinical examples. Learning anchored in practical reality.", rating: 5 },
  { title: "Pathophysiology explained clearly", content: "Complex disease processes explained accessibly without dumbing down. Rare skill in education.", rating: 5 },
  { title: "Biochemistry made understandable", content: "Feared biochemistry but needed it. This course made it accessible. Understood what I couldn't before.", rating: 5 },
  { title: "Anatomy reviews helpful", content: "Quick anatomy reviews at relevant points helped without overwhelming. Just enough foundation when needed.", rating: 5 },
  { title: "Physiology deeply covered", content: "Not surface-level physiologyreal depth that enables true understanding. Foundation for confident practice.", rating: 5 },
  { title: "Systems thinking developed", content: "Learned to see connections between systems. This perspective transforms problem-solving. Core skill developed.", rating: 5 },
  { title: "Root cause methodology clear", content: "The framework for identifying root causes is now second nature. Systematic approach to complex problems.", rating: 5 },
  { title: "Assessment skills sharpened", content: "Know how to assess clients thoroughly now. Comprehensive intake process that reveals what matters.", rating: 5 },
  { title: "Physical assessment basics covered", content: "Basic physical assessment skills taught appropriately. Know what to look for within scope.", rating: 5 },
  { title: "History-taking mastered", content: "The art of taking a thorough history well taught. Most information comes from listening properly.", rating: 5 },
  { title: "Questionnaire tools valuable", content: "Standardized questionnaires included and explained. Ready-to-use assessment tools.", rating: 5 },
  { title: "Timeline approach effective", content: "Creating client timelines reveals patterns otherwise missed. Powerful tool learned here.", rating: 5 },
  { title: "Matrix thinking introduced", content: "Organizing client data in matrices shows connections clearly. Systematic approach to complexity.", rating: 5 },
  { title: "Testing guidance practical", content: "Which tests actually worth ordering and whypractical guidance that saves money and time.", rating: 5 },
  { title: "Lab interpretation mastered", content: "Reading labs functionally is a core skill now. See what others miss because I know what to look for.", rating: 5 },
  { title: "Functional ranges explained", content: "Optimal vs standard ranges clearly explained. This distinction transforms interpretation.", rating: 5 },
  { title: "Treatment hierarchy clear", content: "Know what to address first, second, third. Treatment order matters and this course explains why.", rating: 5 },
  { title: "Foundations-first approach logical", content: "Sleep, stress, diet, movementfoundations first makes sense. Not just supplements, real lifestyle medicine.", rating: 5 },
  { title: "Lifestyle prescription detailed", content: "Not vague advicespecific lifestyle prescriptions for specific conditions. Actionable recommendations.", rating: 5 },
  { title: "Supplement protocols evidence-based", content: "Supplements recommended only where evidence supports. Conservative, responsible approach to supplementation.", rating: 5 },
  { title: "Dosing guidance specific", content: "Not just what to take but how much, when, and for how long. Specific enough to implement confidently.", rating: 5 },
  { title: "Interactions covered thoroughly", content: "Drug-nutrient and nutrient-nutrient interactions explained. Safety through knowledge.", rating: 5 },
  { title: "Contraindications clear", content: "When not to recommend something as important as when to. Safety protocols emphasized appropriately.", rating: 5 },
  { title: "Quality brands identified", content: "Guidance on supplement quality and trusted brands. Practical knowledge that improves outcomes.", rating: 5 },
  { title: "Dietary protocols specific", content: "Not generic healthy eatingspecific therapeutic diets for specific conditions. Targeted nutrition.", rating: 5 },
  { title: "Elimination protocols detailed", content: "Elimination and reintroduction protocols clearly explained. Powerful diagnostic and therapeutic tool.", rating: 5 },
  { title: "Food sensitivities clarified", content: "Difference between allergies, sensitivities, and intolerances clearly explained. Common confusion resolved.", rating: 5 },
  { title: "Macronutrient balance explained", content: "When to adjust macros and whynot one-size-fits-all but individualized approaches.", rating: 5 },
  { title: "Micronutrient depth impressive", content: "Each vitamin and mineral covered in practical depth. Know what they do and how to assess and address deficiencies.", rating: 5 },
  { title: "Phytonutrient knowledge valuable", content: "Beyond vitamins and mineralsphytonutrients and their therapeutic applications. Advanced nutrition knowledge.", rating: 5 },
  { title: "Hydration beyond basics", content: "Not just drink waterelectrolyte balance, mineral content, timing. Thorough hydration guidance.", rating: 5 },
  { title: "Digestion optimization complete", content: "From chewing to eliminationcomplete digestive optimization. Foundation for all nutrient utilization.", rating: 5 },
  { title: "Stomach acid importance emphasized", content: "Hypochlorhydria commonly missed. This course covers stomach acid thoroughly. Key piece often ignored.", rating: 5 },
  { title: "Enzyme support explained", content: "When and how to support digestive enzymes. Practical protocols for improved digestion.", rating: 5 },
  { title: "Bile flow addressed", content: "Bile function often overlooked. This course covers it properly. Important for fat digestion and detox.", rating: 5 },
  { title: "Intestinal permeability covered", content: "Leaky gut explained scientifically with practical protocols. Not hype but real condition with real solutions.", rating: 5 },
  { title: "Microbiome modules excellent", content: "Cutting-edge microbiome science made practical. Know how to assess and address dysbiosis.", rating: 5 },
  { title: "SIBO protocols comprehensive", content: "SIBO is common and complex. This course covers assessment and treatment thoroughly. Ready to help.", rating: 5 },
  { title: "Candida approach balanced", content: "Neither dismissing nor over-diagnosing candida. Balanced, evidence-based approach to yeast.", rating: 5 },
  { title: "Parasite awareness appropriate", content: "Parasites more common than recognized. Appropriate awareness without paranoia. Balanced education.", rating: 5 },
  { title: "Detoxification scientifically covered", content: "Real detox biochemistry, not pseudoscience. Phase I, II, III detoxification clearly explained.", rating: 5 },
  { title: "Environmental toxins addressed", content: "Practical guidance on reducing toxic burden. Actionable environmental medicine.", rating: 5 },
  { title: "Heavy metals covered properly", content: "Assessment and detoxification of heavy metals explained responsibly. Important topic handled well.", rating: 5 },
  { title: "Mold illness awareness", content: "Mold illness often missed. This course covers it enough to recognize and refer appropriately.", rating: 5 },
  { title: "Lyme considerations included", content: "Chronic Lyme complex but covered appropriately. Know when to suspect and how to support.", rating: 5 },
  { title: "Infection impact recognized", content: "Chronic infections affect everything. This course covers their role in chronic illness.", rating: 5 },
  { title: "Viral reactivation understood", content: "EBV, CMV, and other viral reactivation covered. Important piece of many chronic illness pictures.", rating: 5 },
  { title: "Immune modulation not suppression", content: "Balancing immunity rather than suppressing. Nuanced approach to autoimmunity and immune dysfunction.", rating: 5 },
  { title: "Inflammation pathways explained", content: "Understanding inflammatory pathways enables targeted intervention. Core knowledge thoroughly covered.", rating: 5 },
  { title: "Oxidative stress addressed", content: "Free radicals and antioxidants explained properly. Balanced approach to oxidative stress.", rating: 5 },
  { title: "Mitochondrial support detailed", content: "Cellular energy production thoroughly covered. Key to fatigue, aging, and chronic disease.", rating: 5 },
  { title: "Methylation made clear", content: "MTHFR and methylation cycles explained accessibly. Complex biochemistry made understandable.", rating: 5 },
  { title: "Genetic considerations appropriate", content: "Nutrigenomics covered at appropriate depth. Know how to use genetic information responsibly.", rating: 5 },
  { title: "Epigenetics empowering", content: "Genes aren't destiny. Epigenetic influence on health covered empoweringly. Hopeful science.", rating: 5 },
  { title: "Stress response detailed", content: "HPA axis dysfunction thoroughly explained. Understand and address stress at root level.", rating: 5 },
  { title: "Adrenal health beyond fatigue", content: "More nuanced than adrenal fatigue. Proper understanding of HPA axis dysfunction.", rating: 5 },
  { title: "Cortisol rhythm understood", content: "Cortisol patterns and their meaning clearly explained. Know how to assess and address dysregulation.", rating: 5 },
  { title: "Sleep architecture explained", content: "Deep understanding of sleep stages and their importance. Foundation for sleep optimization.", rating: 5 },
  { title: "Circadian biology thorough", content: "Light, meal timing, temperaturecircadian influences thoroughly covered. Powerful lifestyle medicine.", rating: 5 },
  { title: "Neurotransmitter balance addressed", content: "Brain chemistry explained practically. Know how to support balanced neurotransmitters.", rating: 5 },
  { title: "Mood and brain connection clear", content: "Depression, anxiety through functional lens. Understanding enables better support.", rating: 5 },
  { title: "Cognitive optimization practical", content: "Brain health and optimization covered thoroughly. Practical brain-boosting strategies.", rating: 5 },
  { title: "Hormone foundations solid", content: "Complete hormone education from production to metabolism. Foundation for hormone practice.", rating: 5 },
  { title: "Thyroid thoroughly covered", content: "Full thyroid pictureproduction, conversion, receptor, autoimmunity. Complete thyroid education.", rating: 5 },
  { title: "Adrenals and thyroid connected", content: "Thyroid-adrenal connection explained. Can't fix one without addressing the other.", rating: 5 },
  { title: "Sex hormones comprehensive", content: "Estrogen, progesterone, testosteronecomplete coverage for all genders. Thorough hormone education.", rating: 5 },
  { title: "Cycle tracking valuable", content: "Understanding menstrual cycle phases enables targeted support. Valuable women's health skill.", rating: 5 },
  { title: "Fertility support covered", content: "Preconception optimization for both partners explained. Important niche thoroughly covered.", rating: 5 },
  { title: "Pregnancy considerations appropriate", content: "Safe support during pregnancy clearly covered. Know what's safe and what isn't.", rating: 5 },
  { title: "Postpartum support detailed", content: "Fourth trimester needs thoroughly explained. Important window for support.", rating: 5 },
  { title: "Perimenopause navigation guided", content: "This complex transition explained with practical support strategies. Much-needed guidance.", rating: 5 },
  { title: "Menopause management complete", content: "Natural and supported approaches to menopause symptoms. Complete menopause education.", rating: 5 },
  { title: "Men's hormones included", content: "Not just women's healthmen's hormonal needs covered too. Complete hormone education.", rating: 5 },
  { title: "Cardiovascular approach functional", content: "Beyond cholesterolreal cardiovascular risk assessment and management. Thorough heart health.", rating: 5 },
  { title: "Metabolic health comprehensive", content: "Blood sugar, insulin, metabolism thoroughly covered. Foundation for metabolic practice.", rating: 5 },
  { title: "Weight resistance addressed", content: "When weight won't budge despite effortroot causes explained. Beyond calories.", rating: 5 },
  { title: "Body composition focus", content: "Not just weightbody composition optimization. More nuanced health measure.", rating: 5 },
  { title: "Exercise prescription intelligent", content: "Right exercise for right condition at right dose. Intelligent movement prescription.", rating: 5 },
  { title: "Recovery importance emphasized", content: "Recovery as important as activity. Often overlooked aspect thoroughly covered.", rating: 5 },
  { title: "Pain approach comprehensive", content: "Chronic pain from multiple anglesinflammation, structure, nervous system. Complete approach.", rating: 5 },
  { title: "Musculoskeletal basics helpful", content: "Enough musculoskeletal knowledge to identify and refer appropriately. Practical scope.", rating: 5 },
  { title: "Skin health from inside out", content: "Skin reflects inner health. Thorough coverage of skin conditions and internal causes.", rating: 5 },
  { title: "Excellent overall education", content: "Looking back at the complete course, I'm genuinely impressed by the thoroughness. Ready to practice confidently.", rating: 5 },
  { title: "Four stars only because I want more", content: "Giving four stars because I wish the course were even longer with more content. That's how good it is. The quality is excellent, I just want more of it.", rating: 4 },
  { title: "Great course with room for improvement", content: "Solid education overall. Would love to see more on environmental medicine and genomics in future updates. Four stars for now with potential for five.", rating: 4 },
  { title: "Very good but not perfect", content: "Excellent content and well-organized. A few modules felt rushed, and I wished for more case studies. Still highly recommend for anyone serious about functional medicine.", rating: 4 },
];

async function main() {
  const fmCourse = await prisma.course.findFirst({
    where: { slug: "functional-medicine-complete-certification" },
  });

  if (!fmCourse) {
    console.error("Course not found!");
    return;
  }

  console.log(`Found course: ${fmCourse.title}`);

  // Get zombie profiles with accredipro avatars
  const zombies = await prisma.user.findMany({
    where: {
      isFakeProfile: true,
      avatar: { contains: "accredipro.academy" }
    },
    take: 400,
  });

  console.log(`Found ${zombies.length} zombie profiles`);

  if (zombies.length < 390) {
    console.error("Not enough zombie profiles! Need 390, found " + zombies.length);
    return;
  }

  const allReviews = [...reviews1to100, ...reviews101to200, ...reviews201to300, ...reviews301to390];
  console.log(`Total reviews to create: ${allReviews.length}`);

  let created = 0;
  for (let i = 0; i < allReviews.length; i++) {
    const zombie = zombies[i];
    const review = allReviews[i];

    try {
      await prisma.courseReview.create({
        data: {
          courseId: fmCourse.id,
          userId: zombie.id,
          title: review.title,
          content: review.content,
          rating: review.rating,
          isVerified: true,
          isPublic: true,
        },
      });
      created++;
      if (created % 50 === 0) {
        console.log(`Created ${created} reviews...`);
      }
    } catch (error: any) {
      console.log(`Skipped review ${i + 1} (${review.title}): ${error.message?.slice(0, 50)}`);
    }
  }

  console.log(`\n Successfully created ${created} new reviews!`);

  // Final count
  const total = await prisma.courseReview.count({
    where: { courseId: fmCourse.id }
  });
  console.log(`Total reviews for course: ${total}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
