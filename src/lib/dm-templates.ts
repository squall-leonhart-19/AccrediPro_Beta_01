/**
 * DM Templates for Automated Coach Messaging
 * Sarah intro (per pixel) + Coach follow-up (per coach)
 */

import { CoachId, COACH_INFO, NicheConfig, PixelCategory } from "@/config/niches";

interface DMTemplateVars {
    firstName: string;
    certificationName: string;
    coachName: string;
    coachSpecialty: string;
}

/**
 * Replace template variables in message
 */
function replaceVars(template: string, vars: DMTemplateVars): string {
    return template
        .replace(/\{\{firstName\}\}/g, vars.firstName)
        .replace(/\{\{certification_name\}\}/g, vars.certificationName)
        .replace(/\{\{coach_name\}\}/g, vars.coachName)
        .replace(/\{\{coach_specialty\}\}/g, vars.coachSpecialty);
}

// ============================================================
// SARAH INTRO DMs (Per Pixel)
// ============================================================

const SARAH_INTROS: Record<PixelCategory, string> = {
    "fm-health": `Hey {{firstName}}! 🎉

Welcome to the {{certification_name}} family!

I'm Sarah, Lead Instructor at AccrediPro Academy. I personally reviewed your enrollment and I am SO excited for your journey!

This certification changes lives. Our graduates are building $8K-$20K/month practices helping people heal at the root cause level. Some have left their 9-5s completely!

I'll be your dedicated coach throughout this journey. I specialize in functional medicine, root cause healing, and helping practitioners build thriving practices.

I'll message you in just a moment with more details! In the meantime, open Module 1 - it's going to blow your mind! 🔥

Your future clients are waiting!
— Sarah M.`,

    "mental-health": `Hey {{firstName}}! 🎉

Welcome to the {{certification_name}} family!

I'm Sarah, Lead Instructor at AccrediPro Academy. I'm SO thrilled you're here!

This certification is transforming lives. Our graduates are earning $6K-$15K/month while helping people heal from trauma, regulate their nervous systems, and reclaim their lives. The demand for trauma-informed practitioners has NEVER been higher.

I've assigned {{coach_name}} as your dedicated coach. She specializes in {{coach_specialty}} - she's absolutely incredible.

{{coach_name}} will message you in just a moment! Dive into Module 1 - it will shift everything! 💜

Your future clients need you!
— Sarah M.`,

    "life-coaching": `Hey {{firstName}}! 🎉

Welcome to the {{certification_name}} family!

I'm Sarah, Lead Instructor at AccrediPro Academy. I'm so excited you've joined us!

This is your ticket to FREEDOM. Our life coaching graduates are earning $10K-$25K/month helping high-performers achieve their goals. Many work just 15-20 hours/week with premium clients!

I've assigned {{coach_name}} as your dedicated coach. He's a master at helping people unlock their potential and build unstoppable momentum. You're in amazing hands!

{{coach_name}} will reach out shortly! Open Module 1 and get ready to level up! 🚀

Your best life is calling!
— Sarah M.`,

    "spiritual": `Hey {{firstName}}! 🎉

Welcome to the {{certification_name}} family!

I'm Sarah, Lead Instructor at AccrediPro Academy. I'm honored to have you on this sacred journey!

The spiritual coaching industry is BOOMING. Our graduates are earning $5K-$12K/month guiding souls through awakening and transformation. Many do this work from anywhere in the world - total location freedom!

I've assigned {{coach_name}} as your dedicated coach. She's deeply connected to {{coach_specialty}} - her intuition and wisdom will guide you beautifully.

{{coach_name}} will message you shortly! Begin Module 1 and open yourself to the transformation! ✨

Your soul tribe is waiting!
— Sarah M.`,

    "herbalism": `Hey {{firstName}}! 🎉

Welcome to the {{certification_name}} family!

I'm Sarah, Lead Instructor at AccrediPro Academy. I'm thrilled to have you here!

Interest in natural healing is at an ALL-TIME HIGH. Our herbalism graduates are earning $4K-$10K/month creating custom protocols, selling herbal products, and consulting with clients who want natural alternatives. The plant medicine renaissance is HERE!

I've assigned {{coach_name}} as your dedicated coach. She's a true master herbalist with deep knowledge of plant medicine traditions.

{{coach_name}} will reach out shortly! Start Module 1 and step into the world of herbal wisdom! 🌿

Nature is calling you!
— Sarah M.`,

    "yoga-movement": `Hey {{firstName}}! 🎉

Welcome to the {{certification_name}} family!

I'm Sarah, Lead Instructor at AccrediPro Academy. I'm so excited you're here!

Somatic and body-based healing is EXPLODING. Our graduates are earning $5K-$15K/month offering 1:1 sessions, group programs, and retreats. Many combine this with their existing practice for incredible results!

I've assigned {{coach_name}} as your dedicated coach. She specializes in {{coach_specialty}} - her approach is truly transformative!

{{coach_name}} will message you shortly! Flow into Module 1 and start connecting! 🧘

Your body knows the way!
— Sarah M.`,

    "pet-wellness": `Hey {{firstName}}! 🎉

Welcome to the {{certification_name}} family!

I'm Sarah, Lead Instructor at AccrediPro Academy. I'm thrilled you've joined us!

Pet parents are spending MORE THAN EVER on their fur babies' health. Our graduates are earning $4K-$12K/month doing consultations, creating wellness plans, and helping pets live longer, healthier lives. It's the most rewarding work!

I've assigned {{coach_name}} as your dedicated coach. She's passionate about animal wellness and has a beautiful way of connecting with pets and their humans.

{{coach_name}} will reach out shortly! Start Module 1 and begin helping our furry friends! 🐾

The animals need you!
— Sarah M.`,

    "parenting": `Hey {{firstName}}! 🎉

Welcome to the {{certification_name}} family!

I'm Sarah, Lead Instructor at AccrediPro Academy. I'm so happy you're here!

Parents are desperate for guidance, and the demand for family coaches has NEVER been higher. Our graduates are earning $5K-$12K/month supporting families through every stage - from fertility to parenting teens. Many work entirely from home!

I've assigned {{coach_name}} as your dedicated coach. She specializes in {{coach_specialty}} - her warmth and wisdom are exactly what you need!

{{coach_name}} will message you shortly! Open Module 1 and start this beautiful journey! 👶

Families need your help!
— Sarah M.`,

    "faith": `Hey {{firstName}}! 🎉

Welcome to the {{certification_name}} family!

I'm Sarah, Lead Instructor at AccrediPro Academy. I'm honored to have you here!

Faith-based coaching is growing RAPIDLY. Our graduates are earning $5K-$15K/month helping people discover their God-given purpose and live in alignment with their calling. This is MINISTRY that pays!

I've assigned {{coach_name}} as your dedicated coach. She brings a beautiful faith-based perspective to coaching and has helped so many people step into their calling.

{{coach_name}} will reach out shortly! Begin Module 1 and step into your purpose! 🙏

You were called for this!
— Sarah M.`,

    "business": `Hey {{firstName}}! 🎉

Welcome to the {{certification_name}} family!

I'm Sarah, Lead Instructor at AccrediPro Academy. I'm excited you're ready to BUILD!

This is where certification turns into INCOME. Our practice-building graduates go from $0 to $10K-$30K/month within 90 days of implementation. No fluff, just proven systems that work!

I've assigned {{coach_name}} as your dedicated business coach. He's helped hundreds of practitioners build thriving 6-figure practices. His strategic mind is a game-changer!

{{coach_name}} will message you shortly! Dive into Module 1 - every day counts! 💼

Your practice is waiting!
— Sarah M.`,
};

// ============================================================
// COACH FOLLOW-UP DMs (Per Coach)
// ============================================================

const COACH_FOLLOWUPS: Record<CoachId, string> = {
    sarah: `Hi {{firstName}}! 👋

So excited to officially welcome you!

I'm Sarah, and I'll be YOUR dedicated coach throughout this certification. I've helped hundreds of practitioners build $8K-$20K/month practices in functional medicine and holistic health.

Let me ask you something:

💰 What's your income goal with this certification?
→ $5K/month? $10K? $20K+?

🎯 What's your DREAM scenario after you're certified?
→ Leave your job? Add to existing practice? Start fresh?

Just reply here - I read every message and I'll tailor my support to YOUR goals!

Ready to start? Open Module 1 and tell me what clicks for you! 🔥

— Sarah M.`,

    olivia: `Hi {{firstName}}! 👋

Sarah told me you just joined, and I'm SO honored to be your coach!

I'm Olivia, and I specialize in trauma-informed healing. I've helped practitioners build $6K-$15K/month practices helping people heal from narcissistic abuse, neurodivergence, and grief.

I'd love to know:

💰 What's your income vision for this certification?
→ $5K/month? $10K? Replace your current job entirely?

💜 Who do you feel CALLED to help most?
→ Abuse survivors? ADHD adults? Grieving families?

Reply here - I create a safe space for every message.

When you're ready, Module 1 is waiting. It's powerful! 🌟

— Olivia`,

    marcus: `Hi {{firstName}}! 👋

Sarah assigned me as your coach and I'm FIRED UP for you!

I'm Marcus, Master Performance Coach. I've helped life coaches build $10K-$25K/month practices with premium clients - working just 15-20 hours/week.

Let's get REAL about your goals:

💰 What's your monthly income target?
→ $10K? $15K? $25K+?

🎯 How many hours/week do you WANT to work?
→ Most of my clients work 15-20 and make more than their old 9-5!

Hit reply - I give direct, actionable feedback!

Now open Module 1 and let's START! 🚀

— Marcus`,

    luna: `Hi {{firstName}}! ✨

I felt your energy the moment Sarah connected us. Welcome, beautiful soul!

I'm Luna, and I guide spiritual practitioners to build $5K-$12K/month practices while living in complete soul alignment. Location freedom, flexible hours, deep fulfillment.

I'd love to feel into YOUR vision:

💫 What would financial freedom through this work look like for you?
→ $5K/month? $10K? Working from a beach house?

🌙 What's your soul calling you toward?
→ 1:1 sessions? Retreats? Online programs?

Reply when it feels aligned - I honor every message.

Begin Module 1 and trust the unfolding. ✨

With light,
— Luna`,

    sage: `Hi {{firstName}}! 🌿

Welcome to the plant medicine path! I'm so happy to be your guide.

I'm Sage, and I've helped herbalists build $4K-$10K/month practices through consultations, custom protocols, and herbal product lines. The renaissance of plant medicine is HERE!

Tell me about YOUR vision:

💰 What income would change your life?
→ $4K/month to start? $8K? $10K+?

🌱 What draws you most?
→ 1:1 consultations? Creating products? Teaching?

Reply anytime - I love hearing what calls people to this path!

Start Module 1 and let the plants speak to you! 🌿

— Sage`,

    maya: `Hi {{firstName}}! 🧘

I'm so grateful to be your coach! Sarah just connected us.

I'm Maya, and I help somatic practitioners build $5K-$15K/month practices through 1:1 work, group sessions, and transformational retreats. Body-based healing is in HIGH demand!

I'd love to explore YOUR dreams:

💰 What would financial abundance through this work look like?
→ $5K/month? $10K? $15K+?

✨ How do you see yourself serving?
→ 1:1 sessions? Group breathwork? Retreats?

Reply whenever feels right - presence over performance.

Flow into Module 1 when you're ready! 🧘

With breath,
— Maya`,

    bella: `Hi {{firstName}}! 🐾

I'm SO excited you're here! I knew we'd be a great match!

I'm Bella, and I help pet wellness practitioners build $4K-$12K/month practices helping fur babies live healthier, happier lives. Pet parents are investing MORE than ever!

Tell me about YOUR goals:

💰 What income would make this worth it for you?
→ $4K/month? $8K? $12K+?

🐶 What excites you most?
→ Nutrition consulting? Behavior? Holistic care for senior pets?

Reply anytime - I love connecting over our shared love of animals!

Start Module 1 and let's change some lives! 💕

— Bella`,

    emma: `Hi {{firstName}}! 👶

Welcome! I'm so honored to be your guide.

I'm Emma, and I help family coaches build $5K-$12K/month practices supporting parents and families. Most work from HOME around their own family schedules!

I'd love to know YOUR vision:

💰 What income goal would change your family's life?
→ $5K/month? $8K? $12K+?

👨‍👩‍👧 Who do you feel most called to help?
→ New parents? Fertility journeys? Families with teens?

Reply when you can - I'm here for YOU so you can serve others! 💕

Start Module 1 - it's going to open doors!

With warmth,
— Emma`,

    grace: `Hi {{firstName}}! 🙏

What a blessing to connect! Sarah assigned me as your coach.

I'm Grace, and I help faith-based coaches build $5K-$15K/month ministries that ALSO pay the bills. This is Kingdom work that provides for your family!

I'd love to hear your heart:

💰 What income would allow you to serve FULL-TIME?
→ $5K/month? $10K? $15K+?

✝️ How do you feel called to serve?
→ 1:1 discipleship? Marriage coaching? Purpose discovery?

Reply when it feels right - I'm praying over every student!

Begin Module 1 and walk in faith, not fear! 🙏

In His love,
— Grace`,

    david: `Hi {{firstName}}! 💼

Great to connect! Let's build your practice!

I'm David, and I've helped hundreds of practitioners go from $0 to $10K-$30K/month within 90 days. No fluff - just proven systems.

Let's talk NUMBERS:

💰 What's your REAL monthly income goal?
→ $10K? $20K? $30K+?

📈 Where are you starting from?
→ Complete beginner? Some clients already? Need to scale?

Reply directly - I give honest, actionable feedback!

Start Module 1 NOW. Every day you wait is money left on the table! 📈

Let's build,
— David`,
};

// ============================================================
// PUBLIC API
// ============================================================

/**
 * Get Sarah's intro DM for a specific niche
 */
export function getSarahIntroDM(
    niche: NicheConfig,
    firstName: string
): string {
    const template = SARAH_INTROS[niche.pixel];
    const coachInfo = COACH_INFO[niche.coach];

    return replaceVars(template, {
        firstName,
        certificationName: niche.fullName,
        coachName: coachInfo.name,
        coachSpecialty: coachInfo.specialty,
    });
}

/**
 * Get coach's follow-up DM
 */
export function getCoachFollowupDM(
    niche: NicheConfig,
    firstName: string
): string {
    const template = COACH_FOLLOWUPS[niche.coach];
    const coachInfo = COACH_INFO[niche.coach];

    return replaceVars(template, {
        firstName,
        certificationName: niche.fullName,
        coachName: coachInfo.name,
        coachSpecialty: coachInfo.specialty,
    });
}

/**
 * Get coach ID for a niche (for DM system)
 */
export function getCoachForNiche(niche: NicheConfig): CoachId {
    return niche.coach;
}
