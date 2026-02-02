/**
 * Certified Pet Nutrition Specialist Mini Diploma - 60-Day Nurture Sequence
 * 
 * OFFER: $297 Complete Career Certification
 * 
 * What's Included:
 * - 3-Level Certification (PN-FC™ + PN-CP™ + PN-BC™)
 * - Board Certified Master Practitioner title
 * - 25+ in-depth lessons on pet nutrition, species-appropriate diets, wellness protocols
 * - Sarah mentorship access
 * - My Circle Mastermind (5-person pod, DAILY check-ins)
 * - ASI Practitioner Directory listing
 * - Community access (20,000+ practitioners)
 * - LIFETIME ACCESS
 */

function cleanContent(content: string): string {
    return content
        .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}]/gu, '')
        .replace(/\*\*([^*]+)\*\*/g, '$1')
        .replace(/\*([^*]+)\*/g, '$1')
        .replace(/[""]/g, '"')
        .replace(/['']/g, "'")
        .replace(/—/g, '-')
        .trim();
}

const ASI_SIGNATURE = `
Sarah
Board Certified Master Practitioner
AccrediPro Standards Institute`;

export const PET_NUTRITION_NURTURE_SEQUENCE = [
    {
        id: 1, phase: "value", day: 0,
        subject: "Re: your Certified Pet Nutrition Specialist access, {{firstName}}",
        content: cleanContent(`{{firstName}},

You're in.

I just saw your name come through, and I wanted to personally welcome you to the AccrediPro Standards Institute community.

You're now one of thousands who understand that proper nutrition is the foundation of pet health. Practitioners in 47 countries helping pets live longer, healthier lives.

Your Certified Pet Nutrition Specialist Mini Diploma is ready. This isn't like other free courses - this is real training from the same institute that certifies Board Certified Pet Nutrition Specialists.

Here's what I want you to do:

Log in and start Lesson 1. It takes about 10 minutes. By the end, you'll know if this path is calling you.

I'll be checking in over the next few days. And {{firstName}} - if you have ANY questions, just hit reply. I read every email personally.

Your love for animals brought you here. Let's turn that love into expertise.

${ASI_SIGNATURE}

P.S. Check your messages inside the portal - I've left you a personal voice note. Welcome to ASI.`),
    },

    {
        id: 2, phase: "value", day: 1,
        subject: "Re: why I'm passionate about pet nutrition",
        content: cleanContent(`{{firstName}},

Can I tell you a story?

My dog Max was diagnosed with severe allergies at age 4. Constant itching. Ear infections. Hair loss. Miserable.

The vet prescribed special kibble. It helped some, but the problems never fully went away. More medications. More vet visits. More money.

Then I discovered species-appropriate nutrition.

Within WEEKS of changing Max's diet, his symptoms started clearing. Within months, he was a different dog. The vet was shocked. "What did you do?"

Proper nutrition. That's what I did.

Max lived to 16. The vet expected him to be on a cocktail of medications for life. Instead, he thrived.

That's when I knew: I need to help other pet parents understand what I learned.

The training gave me structure. The certification gave me credibility. But the PASSION - that came from watching Max transform.

So tell me, {{firstName}} - what brought you here? A pet you love? Frustration with conventional advice?

Hit reply. I want to hear your story.

${ASI_SIGNATURE}`),
    },

    {
        id: 3, phase: "value", day: 3,
        subject: "Re: why most pet food is failing our pets",
        content: cleanContent(`{{firstName}},

I need to tell you something that might upset you.

Most commercial pet food - even the expensive "premium" brands - is not designed for optimal health. It's designed for:
- Long shelf life
- Low cost
- Convenience

Not for the biological needs of carnivores (dogs and cats).

Many kibbles are:
- 40-60% carbohydrates (dogs need far less)
- Made with low-quality protein sources
- Full of artificial additives
- Cooked at high temperatures (destroying nutrients)

Is it any wonder pets have record rates of:
- Allergies and skin issues
- Digestive problems
- Obesity
- Cancer

When you understand pet nutrition at a foundational level, you see things differently.

Our Board Certified practitioner, Michelle, works with a client whose cat had been on "prescription" food for urinary issues. After transitioning to species-appropriate nutrition, the urinary problems disappeared.

This is what you're learning in your Mini Diploma.

${ASI_SIGNATURE}`),
    },

    {
        id: 4, phase: "value", day: 5,
        subject: "Re: incredible transformation",
        content: cleanContent(`{{firstName}},

I have to share what happened this week.

Michelle, one of our Board Certified Pet Nutrition Specialists, sent me this:

"Sarah, I worked with a pet parent whose 8-year-old Golden Retriever was slow, overweight, had constant ear infections, and was on multiple medications. We transitioned to a balanced, species-appropriate diet over 6 weeks. She just sent me a video of him running and playing like a puppy. He's off all medications. She burst into tears. 'He's like a different dog.'"

This is why pet nutrition matters.

We're not against conventional veterinary care. We COMPLEMENT it. But nutrition is the foundation that makes everything else work better.

Michelle helps pets through:
- Nutritional assessments
- Diet transition planning
- Supplement recommendations
- Addressing specific health concerns nutritionally

The results speak for themselves.

{{firstName}}, keep going with your lessons. Pets need more people who understand this.

${ASI_SIGNATURE}`),
    },

    {
        id: 5, phase: "value", day: 7,
        subject: "Re: how are you finding it?",
        content: cleanContent(`{{firstName}},

It's been a week since you started your Certified Pet Nutrition Specialist Mini Diploma.

What's resonating with you?

Common answers:

1. "I had no idea how inappropriate most commercial pet food is"
2. "The species-appropriate eating concept makes so much sense"
3. "I'm already looking at my pet's food differently"

What about you?

Hit reply and share one thing that clicked.

${ASI_SIGNATURE}

P.S. If you haven't started yet - no judgment. But try to carve out 10 minutes this week. Your pets will thank you.`),
    },

    {
        id: 6, phase: "value", day: 10,
        subject: "Re: a simple tip you can use today",
        content: cleanContent(`{{firstName}},

Quick pet nutrition tip:

Add fresh, whole foods to whatever you're currently feeding.

Even if you're not ready for a full diet transition, you can improve any diet by adding:
- Lightly cooked eggs (excellent protein, cheap)
- Sardines (omega-3s, great for skin/coat)
- Steamed vegetables (fiber, nutrients)
- Raw or cooked meat (what they're designed to eat)

Start small. 10-20% of the bowl.

Watch what happens.

My clients are always amazed at the changes from this ONE simple step.

${ASI_SIGNATURE}`),
    },

    {
        id: 7, phase: "value", day: 12,
        subject: "Re: checking in",
        content: cleanContent(`{{firstName}},

How's your pet nutrition journey going?

If you're making progress - wonderful.

If life got busy - it happens.

The women who complete this Mini Diploma tell me they can never look at pet food the same way again. That awareness is powerful.

What can I help you with?

${ASI_SIGNATURE}

P.S. Reply "DONE" if you've finished, and I'll share what's next.`),
    },

    {
        id: 8, phase: "value", day: 14,
        subject: "Re: two weeks in",
        content: cleanContent(`{{firstName}},

Two weeks since you started.

Wherever you are:

If finished: You now understand pet nutrition at a deeper level than most pet parents - and many pet professionals.

If in progress: Keep going. Every lesson matters.

I see your potential.
I believe in your love for animals.
I'm here.

${ASI_SIGNATURE}`),
    },

    // PHASE 2: DESIRE
    {
        id: 9, phase: "desire", day: 15,
        subject: "Re: Michelle's story",
        content: cleanContent(`{{firstName}},

Let me tell you about Michelle.

Michelle was a veterinary technician for 12 years. She was frustrated.

Every day, sick pets. Every day, the same advice: prescription kibble, medications, more appointments. And most pets not really getting BETTER - just managed.

She knew something was missing. Then she discovered pet nutrition.

She got certified through ASI.

Month 1: Finally understood what she'd sensed for years. Nutrition IS foundational.
Month 2: Started offering nutrition consultations at the clinic. Owners wanted them.
Month 3: Went independent. $125/consultation. More impact than ever.
Month 6: Thriving practice. 15+ clients weekly.

Today: Michelle helps pets that vets had "given up on." Because she addresses the ROOT cause.

Before: "Michelle - Vet Tech"
After: "Michelle, PN-BC - Board Certified Pet Nutrition Specialist"

That credential changed everything.

${ASI_SIGNATURE}`),
    },

    {
        id: 10, phase: "desire", day: 18,
        subject: "Re: my typical day",
        content: cleanContent(`{{firstName}},

What my days look like as a pet nutrition specialist:

9:00am - First consultation. A dog with chronic skin issues. We review current diet, discuss transitions.
10:30am - Second call. A cat with digestive problems. Kibble is the culprit.
12:00pm - Walk my own dogs. Practice what I preach.
1:00pm - Mastermind check-in with my 5.
2:00pm - Virtual consultation. Pet parent in another state.
3:00pm - Done.

I work from home. I set my hours. I actually HELP pets get better.

"I'm Sarah, a Board Certified Pet Nutrition Specialist."

That title means everything to me.

${ASI_SIGNATURE}`),
    },

    {
        id: 11, phase: "desire", day: 21,
        subject: "Re: questions answered",
        content: cleanContent(`{{firstName}},

Your questions, answered:

"Is pet nutrition consulting legal?"
Yes. We provide nutrition education, not veterinary diagnosis or treatment.

"Is the credential recognized?"
ASI credentials are CMA, CPD, IPHM recognized with public verification.

"Will people pay for pet nutrition advice?"
Americans spend $130 billion/year on their pets. They're desperate for real help - and willing to pay.

"Do I need a vet background?"
No. 40% of our practitioners have no formal pet industry experience.

"What about liability?"
We teach you to stay in scope and when to refer to vets.

The only real obstacle is not starting.

${ASI_SIGNATURE}`),
    },

    {
        id: 12, phase: "desire", day: 24,
        subject: "Re: the community",
        content: cleanContent(`{{firstName}},

Here's what nobody tells you about pet nutrition work:

People think you're crazy.

"Why would you feed THAT to a dog?"
"The vet said kibble is fine."
"You're overcomplicating it."

It can feel lonely being the one who KNOWS differently.

That's why we have My Circle Mastermind.

5 fellow pet nutrition specialists. Your pack.

Daily:
- Share wins and challenges
- Discuss client cases
- Support each other
- Learn together

Women who GET IT. Who don't think you're crazy.

This is your tribe.

${ASI_SIGNATURE}`),
    },

    {
        id: 13, phase: "desire", day: 27,
        subject: "Re: two futures",
        content: cleanContent(`{{firstName}},

One year from now:

PATH A: Same knowledge. Same frustration when you see pets eating garbage. Still not certified to help.

PATH B: Board Certified. PN-FC, PN-CP, PN-BC.

"I'm {{firstName}}, PN-BC - Board Certified Pet Nutrition Specialist."

12+ clients monthly. $4,000-$6,000/month. Actually changing pet lives.

Both futures take 365 days.

${ASI_SIGNATURE}`),
    },

    {
        id: 14, phase: "desire", day: 30,
        subject: "Re: ready?",
        content: cleanContent(`{{firstName}},

Complete Career Certification - $297

3 levels: PN-FC, PN-CP, PN-BC
25+ lessons
My Circle Mastermind
ASI Directory listing
All bonuses
LIFETIME access

Ready? https://www.fanbasis.com/agency-checkout/AccrediPro/wmoqw

${ASI_SIGNATURE}`),
    },

    // PHASE 3: DECISION
    {
        id: 15, phase: "decision", day: 31,
        subject: "Re: the path",
        content: cleanContent(`{{firstName}},

Board Certified Pet Nutrition Specialist path:

Level 1: PN-FC - Foundation
Level 2: PN-CP - Practitioner
Level 3: PN-BC - Board Certified

Plus Mastermind, directory, bonuses, lifetime access.

$297 / $125 = 2-3 clients to break even.

${ASI_SIGNATURE}`),
    },

    {
        id: 16, phase: "decision", day: 34,
        subject: "Re: the investment",
        content: cleanContent(`{{firstName}},

$297.

Other pet nutrition certifications: $1,500-$4,000.
Vet tech programs: $10,000+.

You get: 3 levels, certification, Mastermind, directory, bonuses, lifetime access.

2-3 clients = break even.

Michelle made $500+ her first month.

Ready? https://www.fanbasis.com/agency-checkout/AccrediPro/wmoqw

${ASI_SIGNATURE}`),
    },

    {
        id: 17, phase: "decision", day: 36,
        subject: "Re: the credential",
        content: cleanContent(`{{firstName}},

Before: "{{firstName}} - loves animals"
After: "{{firstName}}, PN-BC - Board Certified Pet Nutrition Specialist"

Professional credential. Directory listing. Mastermind support.

People take you seriously.

Ready? https://www.fanbasis.com/agency-checkout/AccrediPro/wmoqw

${ASI_SIGNATURE}`),
    },

    {
        id: 18, phase: "decision", day: 38,
        subject: "Re: concerns",
        content: cleanContent(`{{firstName}},

"I'm not a vet." - You don't need to be. This is nutrition education.
"$297 is a lot." - 2 clients covers it.
"I'm not sure I know enough." - That's what the training is for.
"What if people don't pay?" - Pet parents are DESPERATE for help.

What's really stopping you?

${ASI_SIGNATURE}`),
    },

    {
        id: 19, phase: "decision", day: 40,
        subject: "Re: the Mastermind",
        content: cleanContent(`{{firstName}},

My Circle Mastermind: 5 fellow pet nutrition specialists.

Daily check-ins. Case discussions. Lifetime bonds.

"The Mastermind is my pack. We share wins, help each other with tough cases, and no one thinks I'm crazy for caring this much about pet food." - Michelle

Ready? https://www.fanbasis.com/agency-checkout/AccrediPro/wmoqw

${ASI_SIGNATURE}`),
    },

    {
        id: 20, phase: "decision", day: 42,
        subject: "Re: what they're saying",
        content: cleanContent(`{{firstName}},

MICHELLE, 41: "15+ clients monthly. Pets are THRIVING. This is what I was meant to do."
VET TECH TURNED SPECIALIST: "I help more pets now than I did in 12 years at a clinic."
STAY-AT-HOME MOM: "I work around my kids' schedule and make $3,000+/month helping pets."

They decided. You can too.

${ASI_SIGNATURE}`),
    },

    {
        id: 21, phase: "decision", day: 44,
        subject: "Re: the urgency",
        content: cleanContent(`{{firstName}},

That passion for helping pets? It doesn't go away.

Every day without proper nutrition knowledge = pets suffering unnecessarily.

$297. Two clients. A lifetime helping animals.

https://www.fanbasis.com/agency-checkout/AccrediPro/wmoqw

${ASI_SIGNATURE}`),
    },

    // PHASE 4: RE-ENGAGE
    {
        id: 22, phase: "re-engage", day: 48,
        subject: "Re: still here",
        content: cleanContent(`{{firstName}},

Still here. Door open. Pets still need help.

When you're ready, I'm here.

${ASI_SIGNATURE}`),
    },

    {
        id: 23, phase: "re-engage", day: 52,
        subject: "Re: quick tip",
        content: cleanContent(`{{firstName}},

Quick tip:

Add bone broth to your pet's meals.

It's hydrating, gentle on digestion, and rich in collagen for joint health.

Simple upgrade. Big impact.

${ASI_SIGNATURE}`),
    },

    {
        id: 24, phase: "re-engage", day: 56,
        subject: "Re: thinking of you",
        content: cleanContent(`{{firstName}},

Thought of you today.

Something called you to pet nutrition.

Still calling?

Reply if you want to chat.

${ASI_SIGNATURE}`),
    },

    {
        id: 25, phase: "re-engage", day: 60,
        subject: "Re: final message",
        content: cleanContent(`{{firstName}},

Last scheduled message.

Your love for animals is real. Your potential to help is real. Whether certified or not.

If someday the time is right: https://www.fanbasis.com/agency-checkout/AccrediPro/wmoqw

Give your pets a hug for me.

${ASI_SIGNATURE}`),
    },
];

export type PetNutritionNurtureEmail = typeof PET_NUTRITION_NURTURE_SEQUENCE[number];
